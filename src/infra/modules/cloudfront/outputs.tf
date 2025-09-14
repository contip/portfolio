output "distribution_id" {
  description = "CloudFront Distribution ID"
  value       = aws_cloudfront_distribution.this.id
}

output "distribution_domain_name" {
  description = "CloudFront Distribution domain name"
  value       = aws_cloudfront_distribution.this.domain_name
}

output "distribution_arn" {
  description = "CloudFront Distribution ARN"
  value       = aws_cloudfront_distribution.this.arn
}

output "origin_access_control_id" {
  description = "Origin Access Control ID"
  value       = aws_cloudfront_origin_access_control.this.id
}