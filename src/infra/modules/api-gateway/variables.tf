variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
}

variable "api_description" {
  description = "Description of the API Gateway"
  type        = string
  default     = "Serverless API Gateway"
}

variable "stage_name" {
  description = "Deployment stage name"
  type        = string
  default     = "dev"
}

variable "lambda_invoke_arn" {
  description = "Lambda function invoke ARN"
  type        = string
}

variable "enable_xray_tracing" {
  description = "Enable AWS X-Ray tracing"
  type        = bool
  default     = false
}

variable "log_level" {
  description = "CloudWatch log level (OFF, ERROR, INFO)"
  type        = string
  default     = "INFO"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}