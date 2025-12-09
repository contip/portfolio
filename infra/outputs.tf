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
