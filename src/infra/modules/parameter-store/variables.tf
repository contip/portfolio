variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "parameters" {
  description = "Map of SSM parameters to create"
  type = map(object({
    description = string
    type        = string
    value       = string
    tier        = optional(string, "Standard")
  }))
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}