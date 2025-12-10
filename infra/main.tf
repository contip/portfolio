################################################################################
# Portfolio Infrastructure
#
# Architecture:
# - Next.js frontend on AWS Lambda via OpenNext
# - Payload CMS on AWS Lambda via OpenNext
# - PostgreSQL on RDS (t4g.micro, free tier)
# - Secrets managed via AWS Secrets Manager
################################################################################

terraform {
  backend "s3" {
    bucket         = "portfolio-pconti-tfstate"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "portfolio-pconti-tf-lock"
    encrypt        = true
  }

  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.tags
  }
}

# Provider alias for Route53 (in case hosted zone is in different account)
provider "aws" {
  alias  = "route53"
  region = var.aws_region

  default_tags {
    tags = local.tags
  }
}

# Provider alias for global resources (CloudFront, Lambda@Edge - must be us-east-1)
provider "aws" {
  alias  = "global"
  region = "us-east-1"

  default_tags {
    tags = local.tags
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  name   = var.project
  region = var.aws_region

  # Network configuration
  vpc_cidr              = "10.0.0.0/16"
  public_subnet_cidrs   = ["10.0.0.0/24", "10.0.1.0/24"]
  private_subnet_cidrs  = ["10.0.10.0/24", "10.0.11.0/24"]
  database_subnet_cidrs = ["10.0.20.0/24", "10.0.21.0/24"]
  azs                   = ["${local.region}a", "${local.region}b"]

  # Application ports
  db_port = 5432

  # Database configuration
  db_name     = "portfolio"
  db_username = "payload"

  tags = {
    Project   = var.project
    ManagedBy = "terraform"
  }
}

################################################################################
# Networking
################################################################################

module "vpc" {
  source = "./modules/vpc"

  name                  = local.name
  vpc_cidr              = local.vpc_cidr
  azs                   = local.azs
  public_subnet_cidrs   = local.public_subnet_cidrs
  private_subnet_cidrs  = local.private_subnet_cidrs
  database_subnet_cidrs = local.database_subnet_cidrs

  enable_nat_gateway       = true
  single_nat_gateway       = true # Cost optimization
  enable_s3_endpoint       = true
  enable_dynamodb_endpoint = false

  region = local.region
  tags   = local.tags
}

################################################################################
# Security Groups
################################################################################

resource "aws_security_group" "lambda" {
  name        = "${local.name}-lambda-sg"
  description = "Security group for Lambda functions"
  vpc_id      = module.vpc.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name}-lambda-sg" }
}

resource "aws_security_group" "database" {
  name        = "${local.name}-db-sg"
  description = "Security group for RDS"
  vpc_id      = module.vpc.vpc_id

  # Lambda functions in VPC need access
  ingress {
    description     = "PostgreSQL from Lambda"
    from_port       = local.db_port
    to_port         = local.db_port
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda.id]
  }

  # Bastion access (optional)
  dynamic "ingress" {
    for_each = var.bastion_cidr_blocks
    content {
      description = "PostgreSQL from bastion"
      from_port   = local.db_port
      to_port     = local.db_port
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name}-db-sg" }
}

################################################################################
# Database
################################################################################

module "secrets" {
  source = "./modules/secrets"

  name          = local.name
  database_host = module.rds.address
  database_port = local.db_port

  tags = local.tags
}

module "rds" {
  source = "./modules/rds"

  name                 = local.name
  db_subnet_group_name = module.vpc.database_subnet_group_name
  security_group_ids   = [aws_security_group.database.id]

  database_name     = local.db_name
  database_username = local.db_username
  database_password = module.secrets.database_password

  # Free tier configuration
  instance_class    = "db.t4g.micro"
  allocated_storage = 20
  storage_type      = "gp2"
  multi_az          = false

  # Dev-friendly settings (adjust for production)
  skip_final_snapshot = true
  deletion_protection = false
  apply_immediately   = true

  tags = local.tags
}

################################################################################
# SSL Certificate
################################################################################

module "acm" {
  source = "./modules/acm"

  providers = {
    aws.route53 = aws.route53
  }

  domain_name               = var.domain_name
  subject_alternative_names = ["api.${var.domain_name}", "www.${var.domain_name}"]
  hosted_zone_id            = var.hosted_zone_id

  tags = local.tags
}

################################################################################
# OpenNext - Frontend (Next.js on Lambda)
#
# Uses the tf-aws-open-next-zone submodule for single-zone deployment.
# Requires .open-next build output from: npx @opennextjs/aws build
################################################################################

module "opennext_frontend" {
  source  = "RJPearson94/open-next/aws//modules/tf-aws-open-next-zone"
  version = "3.6.2"

  prefix            = "${replace(var.domain_name, ".", "-")}-frontend"
  folder_path       = var.open_next_frontend_build_path
  open_next_version = "v3.x.x"

  # Custom domain configuration
  domain_config = {
    include_www = true
    hosted_zones = [{
      name         = var.domain_name
      private_zone = false
    }]
    viewer_certificate = {
      acm_certificate_arn = module.acm.certificate_arn
    }
  }

  # CloudFront distribution settings
  distribution = {
    price_class = "PriceClass_100" # US, Canada, Europe only
  }

  # Server function configuration with environment variables for Payload API
  # Note: NEXT_PUBLIC_* vars are baked in at build time, not runtime.
  server_function = {
    additional_environment_variables = {
      PAYLOAD_API_URL = "https://api.${var.domain_name}"
    }
  }

  # Provider configuration - OpenNext requires multiple provider aliases
  providers = {
    aws                 = aws
    aws.global          = aws.global
    aws.iam             = aws
    aws.dns             = aws.route53
    aws.server_function = aws
  }
}

################################################################################
# OpenNext - Payload CMS Backend (Next.js on Lambda)
#
# Payload CMS running as a headless API on api.${domain_name}
################################################################################

module "opennext_backend" {
  source  = "RJPearson94/open-next/aws//modules/tf-aws-open-next-zone"
  version = "3.6.2"

  prefix            = "${replace(var.domain_name, ".", "-")}-backend"
  folder_path       = var.open_next_backend_build_path
  open_next_version = "v3.x.x"

  # Custom domain configuration for API subdomain
  domain_config = {
    include_www = false
    sub_domain  = "api"
    hosted_zones = [{
      name         = var.domain_name
      private_zone = false
    }]
    viewer_certificate = {
      acm_certificate_arn = module.acm.certificate_arn
    }
  }

  # CloudFront distribution settings
  distribution = {
    price_class = "PriceClass_100" # US, Canada, Europe only
  }

  # Server function configuration with database environment variables
  server_function = {
    additional_environment_variables = {
      DATABASE_URI   = "postgresql://${local.db_username}:${module.secrets.database_password}@${module.rds.address}:${local.db_port}/${local.db_name}?sslmode=no-verify"
      PAYLOAD_SECRET = module.secrets.payload_secret
    }
    # VPC configuration so Lambda can reach RDS
    vpc = {
      security_group_ids = [aws_security_group.lambda.id]
      subnet_ids         = module.vpc.private_subnet_ids
    }
  }

  # Provider configuration - OpenNext requires multiple provider aliases
  providers = {
    aws                 = aws
    aws.global          = aws.global
    aws.iam             = aws
    aws.dns             = aws.route53
    aws.server_function = aws
  }
}
