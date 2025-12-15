################################################################################
# Media Storage Module
#
# Creates:
# - S3 bucket for media storage (CloudFront-only access)
# - CloudFront distribution with aggressive caching
# - Origin Access Control (OAC) for secure S3 access
# - IAM user with credentials for Payload CMS S3 plugin
################################################################################

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

################################################################################
# S3 Bucket
################################################################################

resource "aws_s3_bucket" "media" {
  bucket = var.bucket_name

  tags = merge(var.tags, {
    Name = var.bucket_name
  })
}

resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = var.cors_allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

################################################################################
# CloudFront Origin Access Control
################################################################################

resource "aws_cloudfront_origin_access_control" "media" {
  name                              = "${var.name}-media-oac"
  description                       = "OAC for ${var.name} media bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

################################################################################
# S3 Bucket Policy - CloudFront Only Access
################################################################################

data "aws_cloudfront_distribution" "media" {
  id = aws_cloudfront_distribution.media.id
}

resource "aws_s3_bucket_policy" "media" {
  bucket = aws_s3_bucket.media.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.media.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.media.arn
          }
        }
      },
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.media.arn,
          "${aws_s3_bucket.media.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid    = "AllowIAMUserWrite"
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_user.media_upload.arn
        }
        Action = [
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:AbortMultipartUpload",
          "s3:ListBucketMultipartUploads"
        ]
        Resource = [
          aws_s3_bucket.media.arn,
          "${aws_s3_bucket.media.arn}/*"
        ]
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.media]
}

################################################################################
# CloudFront Cache Policy
# Using AWS Managed CachingOptimized policy (658327ea-f89d-4fab-a63d-7e88639e58f6)
# - Min TTL: 1 second
# - Max TTL: 31,536,000 seconds (365 days)
# - Default TTL: 86,400 seconds (24 hours)
# - Gzip/Brotli compression enabled
################################################################################

locals {
  # AWS Managed CachingOptimized policy ID
  caching_optimized_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
}

################################################################################
# CloudFront Response Headers Policy
################################################################################

resource "aws_cloudfront_response_headers_policy" "media" {
  name    = "${var.name}-media-response-headers"
  comment = "Response headers for media assets"

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["GET", "HEAD"]
    }

    access_control_allow_origins {
      items = var.cors_allowed_origins
    }

    access_control_max_age_sec = 86400
    origin_override            = true
  }

  custom_headers_config {
    items {
      header   = "Cache-Control"
      value    = "public, max-age=31536000, immutable"
      override = true
    }
  }
}

################################################################################
# CloudFront Distribution
################################################################################

resource "aws_cloudfront_distribution" "media" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.name} media distribution"
  default_root_object = ""
  price_class         = var.price_class
  aliases             = var.domain_name != "" ? ["media.${var.domain_name}"] : []

  origin {
    domain_name              = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.media.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.media.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.media.id}"

    cache_policy_id            = local.caching_optimized_policy_id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.media.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.certificate_arn == "" ? true : false
    acm_certificate_arn            = var.certificate_arn != "" ? var.certificate_arn : null
    ssl_support_method             = var.certificate_arn != "" ? "sni-only" : null
    minimum_protocol_version       = var.certificate_arn != "" ? "TLSv1.2_2021" : "TLSv1"
  }

  tags = var.tags
}

################################################################################
# Route53 Record for Custom Domain
################################################################################

resource "aws_route53_record" "media" {
  count = var.domain_name != "" && var.hosted_zone_id != "" ? 1 : 0

  zone_id = var.hosted_zone_id
  name    = "media.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.media.domain_name
    zone_id                = aws_cloudfront_distribution.media.hosted_zone_id
    evaluate_target_health = false
  }
}

################################################################################
# IAM User for S3 Access (Payload CMS)
################################################################################

resource "aws_iam_user" "media_upload" {
  name = "${var.name}-media-upload"
  path = "/service/"

  tags = var.tags
}

resource "aws_iam_user_policy" "media_upload" {
  name = "${var.name}-media-upload-policy"
  user = aws_iam_user.media_upload.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowS3BucketAccess"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:AbortMultipartUpload",
          "s3:ListBucketMultipartUploads"
        ]
        Resource = [
          aws_s3_bucket.media.arn,
          "${aws_s3_bucket.media.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_access_key" "media_upload" {
  user = aws_iam_user.media_upload.name
}

################################################################################
# Store S3 Credentials in Secrets Manager
################################################################################

resource "aws_secretsmanager_secret" "s3_credentials" {
  name                    = "${var.name}/s3-credentials"
  recovery_window_in_days = var.recovery_window_in_days

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "s3_credentials" {
  secret_id = aws_secretsmanager_secret.s3_credentials.id

  secret_string = jsonencode({
    S3_ACCESS_KEY_ID     = aws_iam_access_key.media_upload.id
    S3_SECRET_ACCESS_KEY = aws_iam_access_key.media_upload.secret
    S3_BUCKET            = aws_s3_bucket.media.id
    S3_REGION            = var.region
    CLOUDFRONT_DOMAIN    = var.domain_name != "" ? "https://media.${var.domain_name}" : "https://${aws_cloudfront_distribution.media.domain_name}"
  })
}
