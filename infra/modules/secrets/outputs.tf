output "database_secret_arn" {
  description = "ARN of the database secret"
  value       = aws_secretsmanager_secret.database.arn
}

output "database_secret_name" {
  description = "Name of the database secret"
  value       = aws_secretsmanager_secret.database.name
}

output "payload_secret_arn" {
  description = "ARN of the Payload application secret"
  value       = aws_secretsmanager_secret.payload.arn
}

output "payload_secret_name" {
  description = "Name of the Payload application secret"
  value       = aws_secretsmanager_secret.payload.name
}

output "payload_secret" {
  description = "Generated Payload secret for encryption"
  value       = random_password.payload_secret.result
  sensitive   = true
}

output "database_password" {
  description = "Generated database password"
  value       = random_password.db_password.result
  sensitive   = true
}

output "secrets_access_policy_arn" {
  description = "ARN of the IAM policy for secrets access"
  value       = aws_iam_policy.secrets_access.arn
}
