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
# Route53 Hosted Zone
################################################################################

resource "aws_route53_zone" "this" {
  name = var.domain_name

  tags = var.tags
}