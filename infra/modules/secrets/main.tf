terraform {
  required_version = ">= 1.5"
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

################################################################################
# Random Password Generation
################################################################################

resource "random_password" "db_password" {
  length  = 32
  special = false
}

resource "random_password" "app_keys" {
  count   = 4
  length  = 32
  special = false
}

resource "random_password" "api_token_salt" {
  length  = 32
  special = false
}

resource "random_password" "admin_jwt_secret" {
  length  = 32
  special = false
}

resource "random_password" "transfer_token_salt" {
  length  = 32
  special = false
}

resource "random_password" "jwt_secret" {
  length  = 32
  special = false
}

################################################################################
# Database Secrets
################################################################################

resource "aws_secretsmanager_secret" "database" {
  name                    = "${var.name}/database"
  recovery_window_in_days = var.recovery_window_in_days

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "database" {
  secret_id = aws_secretsmanager_secret.database.id

  secret_string = jsonencode({
    username = var.database_username
    password = random_password.db_password.result
    database = var.database_name
    host     = var.database_host
    port     = var.database_port
  })
}

################################################################################
# Strapi Application Secrets
################################################################################

resource "aws_secretsmanager_secret" "strapi" {
  name                    = "${var.name}/strapi"
  recovery_window_in_days = var.recovery_window_in_days

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "strapi" {
  secret_id = aws_secretsmanager_secret.strapi.id

  secret_string = jsonencode({
    APP_KEYS            = join(",", random_password.app_keys[*].result)
    API_TOKEN_SALT      = random_password.api_token_salt.result
    ADMIN_JWT_SECRET    = random_password.admin_jwt_secret.result
    TRANSFER_TOKEN_SALT = random_password.transfer_token_salt.result
    JWT_SECRET          = random_password.jwt_secret.result
  })
}

################################################################################
# IAM Policy for Secret Access
################################################################################

data "aws_iam_policy_document" "secrets_access" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]
    resources = [
      aws_secretsmanager_secret.database.arn,
      aws_secretsmanager_secret.strapi.arn
    ]
  }
}

resource "aws_iam_policy" "secrets_access" {
  name        = "${var.name}-secrets-access"
  description = "Policy to access application secrets"
  policy      = data.aws_iam_policy_document.secrets_access.json

  tags = var.tags
}
