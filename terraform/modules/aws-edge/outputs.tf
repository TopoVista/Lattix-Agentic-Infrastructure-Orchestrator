output "edge" {
  description = "Public edge contract consumed by DNS and deployment automation."
  value = {
    alb_arn           = aws_lb.this.arn
    alb_dns_name      = aws_lb.this.dns_name
    security_group_id = aws_security_group.alb.id
    cloudfront_domain = try(aws_cloudfront_distribution.this[0].domain_name, null)
    public_name       = try(aws_route53_record.this[0].fqdn, null)
  }
}
