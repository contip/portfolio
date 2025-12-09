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

resource "random_password" "payload_secret" {
  length  = 64
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
# Payload Application Secrets
################################################################################

resource "aws_secretsmanager_secret" "payload" {
  name                    = "${var.name}/payload"
  recovery_window_in_days = var.recovery_window_in_days

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "payload" {
  secret_id = aws_secretsmanager_secret.payload.id

  secret_string = jsonencode({
    PAYLOAD_SECRET = random_password.payload_secret.result
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
      aws_secretsmanager_secret.payload.arn
    ]
  }
}

resource "aws_iam_policy" "secrets_access" {
  name        = "${var.name}-secrets-access"
  description = "Policy to access application secrets"
  policy      = data.aws_iam_policy_document.secrets_access.json

  tags = var.tags
}
