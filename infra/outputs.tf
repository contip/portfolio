################################################################################
# Network Outputs
################################################################################

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

################################################################################
# Database Outputs
################################################################################

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
}

output "database_secret_arn" {
  description = "ARN of the database credentials secret"
  value       = module.secrets.database_secret_arn
}

################################################################################
# Payload CMS Outputs
################################################################################

output "payload_secret_arn" {
  description = "ARN of the Payload application secrets"
  value       = module.secrets.payload_secret_arn
}

output "payload_url" {
  description = "Payload CMS URL"
  value       = "https://api.${var.domain_name}"
}

################################################################################
# Frontend Outputs
################################################################################

output "frontend_url" {
  description = "Frontend URL"
  value       = "https://${var.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation"
  value       = module.opennext_frontend.cloudfront_distribution_id
}

################################################################################
# Media Storage Outputs
################################################################################

output "media_bucket_name" {
  description = "S3 bucket name for media storage"
  value       = module.media_storage.bucket_id
}

output "media_cloudfront_distribution_id" {
  description = "CloudFront distribution ID for media"
  value       = module.media_storage.cloudfront_distribution_id
}

output "media_url" {
  description = "URL for accessing media via CloudFront"
  value       = module.media_storage.media_url
}

output "s3_credentials_secret_arn" {
  description = "ARN of the S3 credentials secret in Secrets Manager"
  value       = module.media_storage.s3_credentials_secret_arn
}

################################################################################
# Email Outputs
################################################################################

output "resend_domain_name" {
  description = "Configured Resend sending domain"
  value       = var.resend_domain_name
}

output "email_delivery_mode" {
  description = "Configured Payload email delivery mode"
  value       = var.email_delivery_mode
}
