terraform {
  backend "s3" {
    bucket         = "portfolio-tfstate-dev"
    key            = "environments/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "portfolio-tf-lock-dev"
    encrypt        = true
  }
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


# ECR Repository for Lambda container images
resource "aws_ecr_repository" "lambda" {
  name                 = "${local.name}-lambda"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = local.common_tags
}

# ECR Repository Policy - Allow GitHub Actions to push images
resource "aws_ecr_repository_policy" "lambda" {
  repository = aws_ecr_repository.lambda.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowGitHubActionsPush"
        Effect = "Allow"
        Principal = {
          AWS = var.github_actions_role_arn
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
      },
      {
        Sid    = "AllowLambdaPull"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
      }
    ]
  })
}

# ECR Lifecycle Policy - Clean up old images
resource "aws_ecr_lifecycle_policy" "lambda" {
  repository = aws_ecr_repository.lambda.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Remove untagged images after 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
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


module "lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name}-api"
  memory_size   = 1024  # Increased for container workload
  timeout       = 30
  environment   = "dev"

  # Container image from ECR
  image_uri = var.lambda_image_uri != "" ? var.lambda_image_uri : "${aws_ecr_repository.lambda.repository_url}:latest"

  # API Gateway integration
  api_gateway_execution_arn = module.api_gateway.api_execution_arn

  # VPC Configuration - Lambda in PRIVATE subnets
  vpc_config = {
    subnet_ids         = module.vpc.private_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  # Environment variables for the container
  environment_variables = {
    NODE_ENV = "production"
    PORT     = "8080"
  }

  tags = local.common_tags

  depends_on = [aws_ecr_repository.lambda]
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
  api_gateway_stage   = "dev"  # CRITICAL: This fixes the API routing
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