locals {
  create_alb_certificate        = var.domain_name != null && var.hosted_zone_id != null && var.alb_certificate_arn == null
  effective_alb_certificate_arn = var.alb_certificate_arn != null ? var.alb_certificate_arn : try(aws_acm_certificate_validation.alb[0].certificate_arn, null)
}

resource "aws_acm_certificate" "alb" {
  count = local.create_alb_certificate ? 1 : 0

  domain_name       = var.domain_name
  validation_method = "DNS"
  tags              = merge(var.tags, { Name = var.domain_name })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "certificate_validation" {
  for_each = local.create_alb_certificate ? {
    for option in aws_acm_certificate.alb[0].domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  } : {}

  zone_id = var.hosted_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "alb" {
  count = local.create_alb_certificate ? 1 : 0

  certificate_arn         = aws_acm_certificate.alb[0].arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation : record.fqdn]
}

resource "aws_security_group" "alb" {
  name        = "${var.name_prefix}-edge"
  description = "Public ingress to the Lattix edge load balancer"
  vpc_id      = var.vpc_id
  tags        = merge(var.tags, { Name = "${var.name_prefix}-edge" })
}

resource "aws_vpc_security_group_ingress_rule" "http" {
  for_each = toset(var.allowed_ingress_cidrs)

  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = each.value
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "https" {
  for_each = toset(var.allowed_ingress_cidrs)

  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = each.value
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "all" {
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_lb" "this" {
  name                       = substr("${var.name_prefix}-edge", 0, 32)
  internal                   = false
  load_balancer_type         = "application"
  security_groups            = [aws_security_group.alb.id]
  subnets                    = var.public_subnet_ids
  enable_deletion_protection = var.enable_deletion_protection
  drop_invalid_header_fields = true
  tags                       = var.tags
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = local.effective_alb_certificate_arn == null ? "fixed-response" : "redirect"

    dynamic "fixed_response" {
      for_each = local.effective_alb_certificate_arn == null ? [1] : []
      content {
        content_type = "application/json"
        message_body = "{\"status\":\"not_configured\"}"
        status_code  = "404"
      }
    }

    dynamic "redirect" {
      for_each = local.effective_alb_certificate_arn == null ? [] : [1]
      content {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  }
}

resource "aws_lb_listener" "https" {
  count = local.effective_alb_certificate_arn == null ? 0 : 1

  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = local.effective_alb_certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "application/json"
      message_body = "{\"status\":\"not_configured\"}"
      status_code  = "404"
    }
  }
}

resource "aws_cloudfront_distribution" "this" {
  count = var.enable_cloudfront ? 1 : 0

  enabled         = true
  is_ipv6_enabled = true
  aliases         = var.domain_name != null && var.cloudfront_certificate_arn != null ? [var.domain_name] : []
  price_class     = "PriceClass_100"

  origin {
    domain_name = aws_lb.this.dns_name
    origin_id   = "alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = local.effective_alb_certificate_arn == null ? "http-only" : "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "alb"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "CloudFront-Forwarded-Proto", "Host"]
      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.cloudfront_certificate_arn == null
    acm_certificate_arn            = var.cloudfront_certificate_arn
    ssl_support_method             = var.cloudfront_certificate_arn == null ? null : "sni-only"
    minimum_protocol_version       = var.cloudfront_certificate_arn == null ? "TLSv1" : "TLSv1.2_2021"
  }

  tags = var.tags
}

resource "aws_route53_record" "this" {
  count = var.domain_name != null && var.hosted_zone_id != null && (!var.enable_cloudfront || var.cloudfront_certificate_arn != null) ? 1 : 0

  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.enable_cloudfront ? aws_cloudfront_distribution.this[0].domain_name : aws_lb.this.dns_name
    zone_id                = var.enable_cloudfront ? aws_cloudfront_distribution.this[0].hosted_zone_id : aws_lb.this.zone_id
    evaluate_target_health = var.enable_cloudfront ? false : true
  }
}
