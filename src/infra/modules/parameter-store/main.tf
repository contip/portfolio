terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

################################################################################
# SSM Parameters
################################################################################

resource "aws_ssm_parameter" "parameters" {
  for_each = var.parameters

  name        = each.key
  description = each.value.description
  type        = each.value.type
  value       = each.value.value
  tier        = try(each.value.tier, "Standard")

  tags = merge(
    var.tags,
    {
      Name        = each.key
      Environment = var.environment
    }
  )
}

################################################################################
# IAM Policy for Parameter Access
################################################################################

data "aws_iam_policy_document" "parameter_access" {
  statement {
    sid    = "AllowParameterRead"
    effect = "Allow"

    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:GetParametersByPath"
    ]

    resources = [
      for param_name, _ in var.parameters :
      "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter${param_name}"
    ]
  }
}

resource "aws_iam_policy" "parameter_access" {
  name_prefix = "${var.environment}-parameter-access-"
  description = "Policy for accessing SSM parameters in ${var.environment}"
  policy      = data.aws_iam_policy_document.parameter_access.json

  tags = var.tags
}

################################################################################
# Data Sources
################################################################################

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}