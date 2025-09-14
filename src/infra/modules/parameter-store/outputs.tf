output "parameter_names" {
  description = "List of created parameter names"
  value       = keys(aws_ssm_parameter.parameters)
}

output "parameter_arns" {
  description = "Map of parameter names to ARNs"
  value = {
    for name, param in aws_ssm_parameter.parameters : name => param.arn
  }
}

output "iam_policy_arn" {
  description = "ARN of the IAM policy for parameter access"
  value       = aws_iam_policy.parameter_access.arn
}

output "iam_policy_name" {
  description = "Name of the IAM policy for parameter access"
  value       = aws_iam_policy.parameter_access.name
}