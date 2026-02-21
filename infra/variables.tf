################################################################################
# Required Variables
################################################################################

variable "domain_name" {
  description = "Primary domain name (e.g., portfolio.example.com)"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for the domain"
  type        = string
}

################################################################################
# Optional Variables
################################################################################

variable "project" {
  description = "Project name used for resource naming"
  type        = string
  default     = "portfolio"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "open_next_frontend_build_path" {
  description = "Path to the OpenNext build output directory for frontend"
  type        = string
  default     = "../frontend/.open-next"
}

variable "open_next_backend_build_path" {
  description = "Path to the OpenNext build output directory for Payload backend"
  type        = string
  default     = "../backend/.open-next"
}

variable "bastion_cidr_blocks" {
  description = "CIDR blocks allowed to access the database directly (for bastion/VPN)"
  type        = list(string)
  default     = []
}

variable "app_stage" {
  description = "Deployment stage used by app runtime (e.g., local, production)"
  type        = string
  default     = "production"
}

################################################################################
# Cloudflare Turnstile
################################################################################

variable "turnstile_site_key" {
  description = "Cloudflare Turnstile site key used by frontend widget rendering"
  type        = string
  default     = ""
}

variable "turnstile_secret_key" {
  description = "Cloudflare Turnstile secret key used by backend verification endpoint"
  type        = string
  sensitive   = true
  default     = ""
}

################################################################################
# Transactional Email (Resend)
################################################################################

variable "resend_api_key" {
  description = "Resend API key used by Payload CMS email adapter"
  type        = string
  sensitive   = true
  default     = ""
}

variable "email_from_address" {
  description = "Default from address for outbound transactional email"
  type        = string
  default     = ""
}

variable "email_from_name" {
  description = "Default from name for outbound transactional email"
  type        = string
  default     = ""
}

variable "contact_inbox_email" {
  description = "Primary internal inbox that receives enterprise lead notifications"
  type        = string
  default     = ""
}

variable "consultation_url" {
  description = "Public booking/discovery URL used in client acknowledgement emails"
  type        = string
  default     = ""
}

variable "email_brand_logo_url" {
  description = "Optional absolute URL for email logo shown in React-email templates"
  type        = string
  default     = ""
}

variable "email_response_sla" {
  description = "Response-time promise text used in client acknowledgement emails"
  type        = string
  default     = "1 business day"
}

variable "email_delivery_mode" {
  description = "Payload email dispatch mode: direct, jobs, or capture (no send)"
  type        = string
  default     = "jobs"

  validation {
    condition     = contains(["direct", "jobs", "capture"], var.email_delivery_mode)
    error_message = "email_delivery_mode must be one of: direct, jobs, capture."
  }
}

variable "resend_domain_name" {
  description = "Verified sending domain in Resend (e.g. email.example.com)"
  type        = string
  default     = ""
}

variable "resend_dns_records" {
  description = "DNS records required by Resend domain verification and deliverability setup"
  type = list(object({
    name    = string
    type    = string
    records = list(string)
    ttl     = optional(number, 300)
  }))
  default = []
}

################################################################################
# AI API Keys (for Payload CMS AI features)
################################################################################

variable "openai_api_key" {
  description = "OpenAI API key for AI features"
  type        = string
  sensitive   = true
  default     = ""
}

variable "google_generative_ai_api_key" {
  description = "Google Generative AI API key for AI features"
  type        = string
  sensitive   = true
  default     = ""
}

variable "anthropic_api_key" {
  description = "Anthropic API key for AI features"
  type        = string
  sensitive   = true
  default     = ""
}
