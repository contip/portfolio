terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = local.region
  profile = var.aws_profile

  default_tags {
    tags = local.common_tags
  }
}

locals {
  region = "us-east-1"
  name   = "portfolio-dev"

  vpc_cidr = "10.0.0.0/16"
  azs      = ["us-east-1a", "us-east-1b"]

  common_tags = {
    Environment = "dev"
    Project     = "portfolio"
    ManagedBy   = "terraform"
  }
}

module "vpc" {
  source = "../../modules/vpc"

  name     = local.name
  vpc_cidr = local.vpc_cidr
  azs      = local.azs
  region   = local.region

  # Public subnets - for ALB, NAT Gateway
  public_subnet_cidrs = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  # Private subnets - for Lambda functions
  private_subnet_cidrs = [
    "10.0.10.0/24",
    "10.0.11.0/24"
  ]

  # No database subnets - using DynamoDB (serverless)
  database_subnet_cidrs = []

  # Cost optimization for dev environment
  enable_nat_gateway = true
  single_nat_gateway = true  # Single NAT for dev to save costs

  # Enable VPC endpoints to reduce data transfer costs
  enable_s3_endpoint       = true
  enable_dynamodb_endpoint = true  # Enable this for Lambda to access DynamoDB

  tags = local.common_tags
}

module "dynamodb" {
  source = "../../modules/dynamodb"

  table_name = "${local.name}-table"

  enable_point_in_time_recovery = false  # Save money in dev

  tags = local.common_tags
}

# S3 bucket for Lambda deployments
module "s3_deployments" {
  source = "../../modules/s3"

  bucket_name         = "${local.name}-deployments"
  enable_versioning   = true  # Keep deployment history
  block_public_access = true  # Private bucket

  lifecycle_rules = [
    {
      id     = "cleanup-old-deployments"
      status = "Enabled"
      transitions = [
        {
          days          = 30
          storage_class = "STANDARD_IA"
        }
      ]
      expiration = {
        days = 90  # Delete old deployments after 90 days
      }
    }
  ]

  tags = local.common_tags
}

# S3 bucket for portfolio media/assets
module "s3_media" {
  source = "../../modules/s3"

  bucket_name         = "${local.name}-media"
  enable_versioning   = false
  block_public_access = false  # Will use CloudFront OAI

  cors_rules = [
    {
      allowed_headers = ["*"]
      allowed_methods = ["GET", "HEAD"]
      allowed_origins = ["*"]  # Will restrict via CloudFront
      expose_headers  = ["ETag"]
      max_age_seconds = 3600
    }
  ]

  tags = local.common_tags
}

data "archive_file" "lambda_placeholder" {
  type        = "zip"
  source_file = "../../lambda-placeholder/index.js"
  output_path = "../../lambda-placeholder/function.zip"
}

# Upload initial Lambda placeholder to S3
resource "aws_s3_object" "lambda_placeholder" {
  bucket = module.s3_deployments.bucket_id
  key    = "lambda/placeholder.zip"
  source = data.archive_file.lambda_placeholder.output_path
  etag   = data.archive_file.lambda_placeholder.output_md5
}

module "lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name}-api"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 30
  environment   = "dev"

  # Lambda code from S3
  s3_bucket        = module.s3_deployments.bucket_id
  s3_key           = aws_s3_object.lambda_placeholder.key
  source_code_hash = data.archive_file.lambda_placeholder.output_base64sha256

  # DynamoDB access
  dynamodb_table_name = module.dynamodb.table_name
  dynamodb_table_arn  = module.dynamodb.table_arn

  # API Gateway integration
  api_gateway_execution_arn = module.api_gateway.api_execution_arn

  # VPC Configuration - Lambda in PRIVATE subnets (NOT database subnets!)
  vpc_config = {
    subnet_ids         = module.vpc.private_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  tags = local.common_tags

  depends_on = [aws_s3_object.lambda_placeholder]
}

# Security group for Lambda
resource "aws_security_group" "lambda" {
  name_prefix = "${local.name}-lambda-"
  vpc_id      = module.vpc.vpc_id
  description = "Security group for Lambda functions"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name}-lambda-sg"
    }
  )

  lifecycle {
    create_before_destroy = true
  }
}

module "api_gateway" {
  source = "../../modules/api-gateway"

  api_name        = "${local.name}-api"
  api_description = "Portfolio API Gateway"
  stage_name      = "dev"

  lambda_invoke_arn = module.lambda.invoke_arn

  tags = local.common_tags
}