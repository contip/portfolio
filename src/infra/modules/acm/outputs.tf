output "certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate_validation.this.certificate_arn
}

output "certificate_status" {
  description = "Status of the ACM certificate"
  value       = aws_acm_certificate.this.status
}

output "certificate_domain_name" {
  description = "Domain name of the ACM certificate"
  value       = aws_acm_certificate.this.domain_name
}