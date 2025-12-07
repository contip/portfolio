output "arn" {
  description = "ARN of the load balancer"
  value       = aws_lb.this.arn
}

output "dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.this.dns_name
}

output "zone_id" {
  description = "Hosted zone ID of the load balancer"
  value       = aws_lb.this.zone_id
}

output "target_group_arn" {
  description = "ARN of the target group"
  value       = aws_lb_target_group.this.arn
}

output "http_listener_arn" {
  description = "ARN of the HTTP listener"
  value       = aws_lb_listener.http.arn
}

output "https_listener_arn" {
  description = "ARN of the HTTPS listener"
  value       = try(aws_lb_listener.https[0].arn, null)
}
