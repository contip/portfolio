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

  default_tags {
    tags = local.common_tags
  }
}

# Provider for parent account Route53 access
provider "aws" {
  alias   = "route53"
  region  = local.region

  assume_role {
    role_arn     = var.route53_cross_account_role_arn
    external_id  = "route53-dev-access"
    session_name = "terraform-route53-dev"
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


# S3 bucket for Lambda deployments
module "s3_deployments" {
  source = "../../modules/s3"

  bucket_name         = "${local.name}-deployments"
  enable_versioning   = true  # Keep deployment history
  block_public_access = true  # Private bucket

  # Bucket policy to allow GitHub Actions IAM role access
  bucket_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowGitHubActionsAccess"
        Effect = "Allow"
        Principal = {
          AWS = var.github_actions_role_arn
        }
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "arn:aws:s3:::${local.name}-deployments/*"
      },
      {
        Sid    = "AllowGitHubActionsListBucket"
        Effect = "Allow"
        Principal = {
          AWS = var.github_actions_role_arn
        }
        Action   = "s3:ListBucket"
        Resource = "arn:aws:s3:::${local.name}-deployments"
      }
    ]
  })

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
  handler       = "lambda.handler"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 30
  environment   = "dev"

  # Lambda code from S3 (dynamic deployment)
  s3_bucket        = module.s3_deployments.bucket_id
  s3_key           = var.lambda_s3_key
  source_code_hash = var.lambda_source_code_hash != "" ? var.lambda_source_code_hash : data.archive_file.lambda_placeholder.output_base64sha256

  # No DynamoDB dependencies for public demo

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

# Attach Parameter Store access to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_parameter_access" {
  role       = module.lambda.role_name
  policy_arn = module.parameter_store.iam_policy_arn
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

module "parameter_store" {
  source = "../../modules/parameter-store"

  environment = "dev"

  parameters = {
    "/portfolio/dev/jwt_secret" = {
      description = "JWT secret for authentication"
      type        = "SecureString"
      value       = "portfolio-jwt-secret-dev-${random_password.jwt_secret.result}"
    }
    "/portfolio/dev/google_client_id" = {
      description = "Google OAuth Client ID"
      type        = "String"
      value       = var.google_client_id
    }
    "/portfolio/dev/google_client_secret" = {
      description = "Google OAuth Client Secret"
      type        = "SecureString"
      value       = var.google_client_secret
    }
    "/portfolio/dev/allowed_emails" = {
      description = "Comma-separated list of allowed emails"
      type        = "String"
      value       = var.allowed_emails
    }
    "/portfolio/dev/application_stage" = {
      description = "Application stage"
      type        = "String"
      value       = var.application_stage
    }
  }

  tags = local.common_tags
}

resource "random_password" "jwt_secret" {
  length  = 64
  special = true
}

module "api_gateway" {
  source = "../../modules/api-gateway"

  api_name        = "${local.name}-api"
  api_description = "Portfolio API Gateway"
  stage_name      = "dev"

  lambda_invoke_arn = module.lambda.invoke_arn

  tags = local.common_tags
}

# Using existing hosted zone from parent account
# Note: petertconti.com domain and hosted zone are in the parent AWS account
# ACM can still validate across accounts using DNS validation

# S3 bucket for frontend hosting
module "s3_frontend" {
  source = "../../modules/s3"

  bucket_name         = "dev.petertconti.com"
  enable_versioning   = false
  block_public_access = true  # CloudFront OAC will handle access

  tags = local.common_tags
}

# ACM Certificate for dev.petertconti.com
module "acm" {
  source = "../../modules/acm"

  domain_name    = "dev.petertconti.com"
  hosted_zone_id = var.hosted_zone_id  # From parent account

  tags = local.common_tags

  providers = {
    aws.route53 = aws.route53
  }
}

# CloudFront Distribution
module "cloudfront" {
  source = "../../modules/cloudfront"

  environment         = "dev"
  domain_names        = ["dev.petertconti.com"]
  hosted_zone_id      = var.hosted_zone_id  # From parent account
  certificate_arn     = module.acm.certificate_arn
  api_gateway_domain  = module.api_gateway.api_domain_name
  s3_bucket_domain    = module.s3_frontend.bucket_regional_domain_name

  tags = local.common_tags

  providers = {
    aws.route53 = aws.route53
  }

  depends_on = [module.acm]
}

# S3 bucket policy for CloudFront OAC access (created after CloudFront)
resource "aws_s3_bucket_policy" "frontend_cloudfront_policy" {
  bucket = module.s3_frontend.bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontAccess"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3_frontend.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [module.cloudfront, module.s3_frontend]
}