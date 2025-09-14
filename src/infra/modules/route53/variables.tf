variable "domain_name" {
  description = "Primary domain name for the hosted zone"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}