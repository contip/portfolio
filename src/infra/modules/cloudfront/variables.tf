variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "domain_names" {
  description = "List of domain names for this distribution"
  type        = list(string)
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for domain"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
}

variable "api_gateway_domain" {
  description = "API Gateway domain name"
  type        = string
}

variable "api_gateway_stage" {
  description = "API Gateway stage name for origin path"
  type        = string
  default     = ""
}

variable "s3_bucket_domain" {
  description = "S3 bucket regional domain name"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}