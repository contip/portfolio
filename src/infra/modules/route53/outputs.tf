output "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  value       = aws_route53_zone.this.zone_id
}

output "name_servers" {
  description = "Route53 name servers"
  value       = aws_route53_zone.this.name_servers
}

output "domain_name" {
  description = "Domain name of the hosted zone"
  value       = aws_route53_zone.this.name
}