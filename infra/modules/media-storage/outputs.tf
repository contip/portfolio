################################################################################
# S3 Outputs
################################################################################

output "bucket_id" {
  description = "S3 bucket ID"
  value       = aws_s3_bucket.media.id
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.media.arn
}

output "bucket_regional_domain_name" {
  description = "S3 bucket regional domain name"
  value       = aws_s3_bucket.media.bucket_regional_domain_name
}

################################################################################
# CloudFront Outputs
################################################################################

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.media.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.media.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.media.domain_name
}

output "media_url" {
  description = "Full URL for media access (custom domain or CloudFront)"
  value       = var.domain_name != "" ? "https://media.${var.domain_name}" : "https://${aws_cloudfront_distribution.media.domain_name}"
}

################################################################################
# IAM Outputs
################################################################################

output "iam_user_arn" {
  description = "IAM user ARN for S3 access"
  value       = aws_iam_user.media_upload.arn
}

output "iam_user_name" {
  description = "IAM user name for S3 access"
  value       = aws_iam_user.media_upload.name
}

################################################################################
# Secrets Outputs
################################################################################

output "s3_credentials_secret_arn" {
  description = "ARN of the S3 credentials secret"
  value       = aws_secretsmanager_secret.s3_credentials.arn
}

output "s3_credentials_secret_name" {
  description = "Name of the S3 credentials secret"
  value       = aws_secretsmanager_secret.s3_credentials.name
}

################################################################################
# Environment Variables for Lambda
# These are exposed separately for direct use in Lambda configuration
################################################################################

output "s3_access_key_id" {
  description = "S3 access key ID for Payload CMS"
  value       = aws_iam_access_key.media_upload.id
  sensitive   = true
}

output "s3_secret_access_key" {
  description = "S3 secret access key for Payload CMS"
  value       = aws_iam_access_key.media_upload.secret
  sensitive   = true
}

output "s3_bucket" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.media.id
}

output "s3_region" {
  description = "S3 bucket region"
  value       = var.region
}
