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

output "strapi_secret_arn" {
  description = "ARN of the Strapi application secrets"
  value       = module.secrets.strapi_secret_arn
}

################################################################################
# Strapi Outputs
################################################################################

output "strapi_alb_dns" {
  description = "Strapi ALB DNS name"
  value       = module.alb.dns_name
}

output "strapi_url" {
  description = "Strapi API URL"
  value       = "https://api.${var.domain_name}"
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs_strapi.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs_strapi.service_name
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
  value       = module.opennext.cloudfront_distribution_id
}
