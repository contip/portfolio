################################################################################
# Terraform State Bootstrap
#
# This configuration creates the S3 bucket and DynamoDB table needed for
# Terraform remote state management. Run this FIRST before the main infra.
#
# Usage:
#   cd bootstrap
#   terraform init
#   terraform apply
################################################################################

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project
      ManagedBy = "terraform"
      Purpose   = "terraform-state"
    }
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "portfolio-pconti"
}

locals {
  bucket_name = "${var.project}-tfstate"
  table_name  = "${var.project}-tf-lock"
}

################################################################################
# S3 Bucket for State
################################################################################

resource "aws_s3_bucket" "state" {
  bucket = local.bucket_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket = aws_s3_bucket.state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

################################################################################
# DynamoDB Table for State Locking
################################################################################

resource "aws_dynamodb_table" "lock" {
  name         = local.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

################################################################################
# ECR Repository for Strapi
################################################################################

resource "aws_ecr_repository" "strapi" {
  name                 = "${var.project}-strapi"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_ecr_lifecycle_policy" "strapi" {
  repository = aws_ecr_repository.strapi.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep only last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = {
        type = "expire"
      }
    }]
  })
}

################################################################################
# Outputs
################################################################################

output "state_bucket" {
  description = "S3 bucket for Terraform state"
  value       = aws_s3_bucket.state.bucket
}

output "lock_table" {
  description = "DynamoDB table for state locking"
  value       = aws_dynamodb_table.lock.name
}

output "ecr_repository_url" {
  description = "ECR repository URL for Strapi"
  value       = aws_ecr_repository.strapi.repository_url
}

output "backend_config" {
  description = "Backend configuration for main Terraform"
  value       = <<-EOT
    terraform {
      backend "s3" {
        bucket         = "${aws_s3_bucket.state.bucket}"
        key            = "terraform.tfstate"
        region         = "${var.aws_region}"
        dynamodb_table = "${aws_dynamodb_table.lock.name}"
        encrypt        = true
      }
    }
  EOT
}
