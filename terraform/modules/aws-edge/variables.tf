variable "name_prefix" {
  type        = string
  description = "Prefix used for edge resource names."
}

variable "vpc_id" {
  type        = string
  description = "VPC containing the public load balancer."
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Public subnets used by the load balancer."
}

variable "allowed_ingress_cidrs" {
  type        = list(string)
  description = "CIDRs allowed to reach the public load balancer."
  default     = ["0.0.0.0/0"]
}

variable "domain_name" {
  type        = string
  description = "Optional public DNS name."
  default     = null
}

variable "hosted_zone_id" {
  type        = string
  description = "Optional Route 53 hosted zone identifier."
  default     = null
}

variable "alb_certificate_arn" {
  type        = string
  description = "Optional ACM certificate ARN for the ALB."
  default     = null
}

variable "enable_deletion_protection" {
  type        = bool
  description = "Protect the edge load balancer from accidental deletion."
  default     = true
}

variable "enable_cloudfront" {
  type        = bool
  description = "Place CloudFront in front of the ALB."
  default     = true
}

variable "cloudfront_certificate_arn" {
  type        = string
  description = "Optional us-east-1 ACM certificate ARN for a CloudFront alias."
  default     = null
}

variable "tags" {
  type        = map(string)
  description = "Required ownership and cost allocation tags."
}
