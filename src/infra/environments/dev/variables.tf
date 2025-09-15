variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
}

variable "allowed_emails" {
  description = "Comma-separated list of allowed emails for authentication"
  type        = string
}

variable "application_stage" {
  description = "Application stage for resource naming"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID from parent account (petertconti.com)"
  type        = string
}

variable "route53_cross_account_role_arn" {
  description = "ARN of the cross-account IAM role for Route53 access in parent account"
  type        = string
}

variable "lambda_image_uri" {
  description = "ECR image URI for Lambda container (optional - uses latest if not specified)"
  type        = string
  default     = ""
}

variable "github_actions_role_arn" {
  description = "ARN of the GitHub Actions IAM role for deployment access"
  type        = string
}
