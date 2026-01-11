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
