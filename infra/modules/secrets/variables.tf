variable "name" {
  description = "Name prefix for all resources"
  type        = string
}

variable "database_username" {
  description = "Database master username"
  type        = string
  default     = "strapi"
}

variable "database_name" {
  description = "Database name"
  type        = string
  default     = "portfolio"
}

variable "database_host" {
  description = "Database host endpoint"
  type        = string
}

variable "database_port" {
  description = "Database port"
  type        = number
  default     = 5432
}

variable "recovery_window_in_days" {
  description = "Number of days before secret can be deleted (0 for immediate)"
  type        = number
  default     = 0
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
