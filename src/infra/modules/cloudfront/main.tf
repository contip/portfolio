terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [aws.route53]
    }
  }
}

################################################################################
# CloudFront Distribution
################################################################################

resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Portfolio CloudFront Distribution"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # US, Canada, Europe only - cost optimization

  aliases = var.domain_names

  # Origin - API Gateway
  origin {
    domain_name = var.api_gateway_domain
    origin_id   = "api-gateway"
    origin_path = ""

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Origin - S3 Frontend
  origin {
    domain_name              = var.s3_bucket_domain
    origin_id                = "s3-frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  # Default behavior - Frontend (S3)
  default_cache_behavior {
    target_origin_id       = "s3-frontend"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]

    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # AWS Managed - CachingOptimized
  }

  # API routes - Backend (API Gateway)
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "api-gateway"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]

    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # AWS Managed - CachingDisabled
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" # AWS Managed - CORS-S3Origin
  }

  # SPA fallback for client-side routing
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  # SSL Certificate
  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Geographic restrictions - none
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = var.tags
}

################################################################################
# Origin Access Control for S3
################################################################################

resource "aws_cloudfront_origin_access_control" "this" {
  name                              = var.environment
  description                       = "OAC for ${var.environment} S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

################################################################################
# Route53 Records
################################################################################

resource "aws_route53_record" "this" {
  provider = aws.route53
  count = length(var.domain_names)

  zone_id = var.hosted_zone_id
  name    = var.domain_names[count.index]
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.this.domain_name
    zone_id                = aws_cloudfront_distribution.this.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "ipv6" {
  provider = aws.route53
  count = length(var.domain_names)

  zone_id = var.hosted_zone_id
  name    = var.domain_names[count.index]
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.this.domain_name
    zone_id                = aws_cloudfront_distribution.this.hosted_zone_id
    evaluate_target_health = false
  }
}