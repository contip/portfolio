output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnet_ids
}

output "nat_gateway_public_ips" {
  description = "List of public IPs of NAT Gateways"
  value       = module.vpc.nat_gateway_public_ips
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = module.api_gateway.api_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.lambda.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = module.lambda.arn
}

output "ecr_repository_url" {
  description = "ECR repository URL for Lambda container images"
  value       = aws_ecr_repository.lambda.repository_url
}

output "ecr_repository_arn" {
  description = "ECR repository ARN"
  value       = aws_ecr_repository.lambda.arn
}

output "cloudfront_distribution_url" {
  description = "CloudFront distribution URL"
  value       = "https://dev.petertconti.com"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.distribution_id
}

output "s3_frontend_bucket" {
  description = "S3 bucket for frontend hosting"
  value       = module.s3_frontend.bucket_id
}

output "s3_media_bucket" {
  description = "S3 bucket for media/assets"
  value       = module.s3_media.bucket_id
}