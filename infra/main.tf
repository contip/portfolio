################################################################################
# Portfolio Infrastructure
#
# Architecture:
# - Next.js frontend on AWS Lambda via OpenNext
# - Strapi CMS on ECS Fargate with ALB
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
  strapi_port = 1337
  db_port     = 5432

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

resource "aws_security_group" "alb" {
  name        = "${local.name}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name}-alb-sg" }
}

resource "aws_security_group" "ecs" {
  name        = "${local.name}-ecs-sg"
  description = "Security group for ECS tasks"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "From ALB"
    from_port       = local.strapi_port
    to_port         = local.strapi_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name}-ecs-sg" }
}

resource "aws_security_group" "database" {
  name        = "${local.name}-db-sg"
  description = "Security group for RDS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "PostgreSQL from ECS"
    from_port       = local.db_port
    to_port         = local.db_port
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
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

  database_name     = "portfolio"
  database_username = "strapi"
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
  subject_alternative_names = ["api.${var.domain_name}"]
  hosted_zone_id            = var.hosted_zone_id

  tags = local.tags
}

################################################################################
# Load Balancer (for Strapi)
################################################################################

module "alb" {
  source = "./modules/alb"

  name               = "${local.name}-strapi"
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.public_subnet_ids
  security_group_ids = [aws_security_group.alb.id]

  target_port       = local.strapi_port
  certificate_arn   = module.acm.certificate_arn
  enable_https      = true
  health_check_path = "/_health"

  tags = local.tags
}

################################################################################
# ECS (Strapi)
################################################################################

module "ecs_strapi" {
  source = "./modules/ecs"

  name       = "${local.name}-strapi"
  aws_region = local.region

  container_name  = "strapi"
  container_image = var.strapi_image
  container_port  = local.strapi_port

  cpu    = var.strapi_cpu
  memory = var.strapi_memory

  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [aws_security_group.ecs.id]
  target_group_arn   = module.alb.target_group_arn

  secrets_policy_arn    = module.secrets.secrets_access_policy_arn
  attach_secrets_policy = true

  environment_variables = [
    { name = "NODE_ENV", value = "production" },
    { name = "HOST", value = "0.0.0.0" },
    { name = "PORT", value = tostring(local.strapi_port) },
    { name = "DATABASE_CLIENT", value = "postgres" },
    { name = "DATABASE_HOST", value = module.rds.address },
    { name = "DATABASE_PORT", value = tostring(local.db_port) },
    { name = "DATABASE_NAME", value = "portfolio" },
    { name = "DATABASE_USERNAME", value = "strapi" },
    { name = "DATABASE_SSL", value = "true" },
    { name = "APP_URL", value = "https://api.${var.domain_name}" },
  ]

  secrets = [
    { name = "DATABASE_PASSWORD", valueFrom = "${module.secrets.database_secret_arn}:password::" },
    { name = "APP_KEYS", valueFrom = "${module.secrets.strapi_secret_arn}:APP_KEYS::" },
    { name = "API_TOKEN_SALT", valueFrom = "${module.secrets.strapi_secret_arn}:API_TOKEN_SALT::" },
    { name = "ADMIN_JWT_SECRET", valueFrom = "${module.secrets.strapi_secret_arn}:ADMIN_JWT_SECRET::" },
    { name = "TRANSFER_TOKEN_SALT", valueFrom = "${module.secrets.strapi_secret_arn}:TRANSFER_TOKEN_SALT::" },
    { name = "JWT_SECRET", valueFrom = "${module.secrets.strapi_secret_arn}:JWT_SECRET::" },
  ]

  tags = local.tags
}

################################################################################
# Route53 Records
################################################################################

resource "aws_route53_record" "api" {
  provider = aws.route53

  zone_id = var.hosted_zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = module.alb.dns_name
    zone_id                = module.alb.zone_id
    evaluate_target_health = true
  }
}

################################################################################
# OpenNext (Next.js on Lambda)
#
# Uses the tf-aws-open-next-zone submodule for single-zone deployment.
# Requires .open-next build output from: npx @opennextjs/aws build
################################################################################

module "opennext" {
  source  = "RJPearson94/open-next/aws//modules/tf-aws-open-next-zone"
  version = "3.6.2"

  prefix            = replace(var.domain_name, ".", "-")
  folder_path       = var.open_next_build_path
  open_next_version = "v3.x.x"

  # Custom domain configuration
  # Note: Not passing hosted_zone id due to a bug in the module (coalesce evaluates
  # all arguments causing Invalid index error). The module will look up the zone by name.
  domain_config = {
    include_www = true
    hosted_zones = [{
      name         = var.domain_name
      private_zone = false
    }]
  }

  # CloudFront distribution settings
  distribution = {
    price_class = "PriceClass_100" # US, Canada, Europe only
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
