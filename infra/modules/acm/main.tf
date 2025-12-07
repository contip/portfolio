terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 5.0"
      configuration_aliases = [aws.route53]
    }
  }
}

################################################################################
# ACM Certificate
################################################################################

locals {
  # Static keys (known at plan time)
  cert_domains = toset(concat([var.domain_name], var.subject_alternative_names))

  # Map the DVOs by domain (values can be unknown until the cert is created — that's OK)
  dvo_map = {
    for dvo in aws_acm_certificate.this.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }
}

resource "aws_acm_certificate" "this" {
  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = var.tags
}

################################################################################
# Route53 Validation Records
################################################################################

resource "aws_route53_record" "validation" {
  provider = aws.route53

  # Keys are stable: domain names you passed in
  for_each = { for d in local.cert_domains : d => d }

  zone_id = var.hosted_zone_id

  # Values resolve after the cert is created (fine at plan time)
  name    = local.dvo_map[each.key].name
  type    = local.dvo_map[each.key].type
  records = [local.dvo_map[each.key].record]
  ttl     = 60

  allow_overwrite = true

  depends_on = [aws_acm_certificate.this]
}

################################################################################
# Certificate Validation
################################################################################

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for k, v in aws_route53_record.validation : v.fqdn]

  timeouts {
    create = "5m"
  }
}