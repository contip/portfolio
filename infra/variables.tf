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

variable "strapi_image" {
  description = "ECR image URI for the Strapi container"
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

variable "strapi_cpu" {
  description = "CPU units for Strapi task (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 512
}

variable "strapi_memory" {
  description = "Memory in MiB for Strapi task"
  type        = number
  default     = 1024
}

variable "open_next_build_path" {
  description = "Path to the OpenNext build output directory"
  type        = string
  default     = "../frontend/.open-next"
}

variable "bastion_cidr_blocks" {
  description = "CIDR blocks allowed to access the database directly (for bastion/VPN)"
  type        = list(string)
  default     = []
}

variable "strapi_api_token" {
  description = "Strapi API token for frontend access (created in Strapi admin UI, leave empty initially)"
  type        = string
  default     = ""
  sensitive   = true
}
