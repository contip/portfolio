output "api_id" {
  description = "API Gateway ID"
  value       = aws_api_gateway_rest_api.this.id
}

output "api_url" {
  description = "API Gateway invoke URL"
  value       = aws_api_gateway_stage.this.invoke_url
}

output "api_execution_arn" {
  description = "API Gateway execution ARN"
  value       = aws_api_gateway_rest_api.this.execution_arn
}

output "stage_name" {
  description = "API Gateway stage name"
  value       = aws_api_gateway_stage.this.stage_name
}

output "api_domain_name" {
  description = "API Gateway domain name for CloudFront origin"
  value       = "${aws_api_gateway_rest_api.this.id}.execute-api.${data.aws_region.current.name}.amazonaws.com"
}

data "aws_region" "current" {}