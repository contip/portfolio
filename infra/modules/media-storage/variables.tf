################################################################################
# Required Variables
################################################################################

variable "name" {
  description = "Name prefix for all resources"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name for media storage"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

################################################################################
# Optional Variables
################################################################################

variable "domain_name" {
  description = "Domain name for the media subdomain (e.g., example.com creates media.example.com)"
  type        = string
  default     = ""
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for DNS records"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ACM certificate ARN for custom domain (must include media.domain_name)"
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100" # US, Canada, Europe
}

variable "cors_allowed_origins" {
  description = "Origins allowed for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "recovery_window_in_days" {
  description = "Number of days before secrets can be deleted (0 for immediate)"
  type        = number
  default     = 0
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
