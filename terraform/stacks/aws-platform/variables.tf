variable "project_name" {
  type        = string
  description = "Stable project identifier."
}

variable "environment" {
  type        = string
  description = "Environment boundary."
}

variable "region" {
  type        = string
  description = "Primary AWS region."
}

variable "owner" {
  type        = string
  description = "Owning team."
}

variable "cost_center" {
  type        = string
  description = "Cost allocation identifier."
}

variable "additional_tags" {
  type        = map(string)
  description = "Additional resource tags."
  default     = {}
}

variable "vpc_cidr" {
  type        = string
  description = "Environment VPC CIDR."
}

variable "availability_zones" {
  type        = list(string)
  description = "Availability zones used by the platform."
}

variable "nat_gateway_count" {
  type        = number
  description = "Number of NAT gateways."
  default     = 1
}

variable "github_repository" {
  type        = string
  description = "GitHub owner/repository trusted through OIDC."
  default     = null
}

variable "operator_principal_arns" {
  type        = list(string)
  description = "IAM principals allowed to assume the operator role."
  default     = []
}

variable "admin_principal_arns" {
  type        = set(string)
  description = "Additional EKS administrator principals."
  default     = []
}

variable "database_instance_class" {
  type        = string
  description = "RDS instance class."
  default     = "db.t4g.small"
}

variable "database_multi_az" {
  type        = bool
  description = "Enable RDS Multi-AZ."
  default     = false
}

variable "database_deletion_protection" {
  type        = bool
  description = "Enable RDS deletion protection."
  default     = true
}

variable "redis_node_type" {
  type        = string
  description = "ElastiCache node type."
  default     = "cache.t4g.small"
}

variable "redis_replicas" {
  type        = number
  description = "Number of Redis replicas."
  default     = 1
}

variable "enable_msk" {
  type        = bool
  description = "Provision Amazon MSK."
  default     = false
}

variable "kubernetes_version" {
  type        = string
  description = "EKS Kubernetes version."
  default     = "1.31"
}

variable "eks_endpoint_public_access" {
  type        = bool
  description = "Enable public access to the EKS API."
  default     = false
}

variable "eks_public_access_cidrs" {
  type        = list(string)
  description = "CIDRs allowed to use the public EKS API."
  default     = []
}

variable "node_instance_types" {
  type        = list(string)
  description = "EKS general node instance types."
  default     = ["m7i.large"]
}

variable "node_min_size" {
  type    = number
  default = 2
}

variable "node_desired_size" {
  type    = number
  default = 2
}

variable "node_max_size" {
  type    = number
  default = 6
}

variable "domain_name" {
  type        = string
  description = "Optional public DNS name."
  default     = null
}

variable "hosted_zone_id" {
  type        = string
  description = "Optional Route 53 zone identifier."
  default     = null
}

variable "alb_certificate_arn" {
  type        = string
  description = "Optional regional ACM certificate ARN."
  default     = null
}

variable "cloudfront_certificate_arn" {
  type        = string
  description = "Optional us-east-1 ACM certificate ARN."
  default     = null
}

variable "enable_cloudfront" {
  type        = bool
  description = "Enable CloudFront in front of the ALB."
  default     = true
}

variable "edge_deletion_protection" {
  type        = bool
  description = "Protect the ALB from accidental deletion."
  default     = true
}

variable "monthly_budget_usd" {
  type        = number
  description = "Monthly environment budget."
  default     = 500
}

variable "budget_alert_email" {
  type        = string
  description = "Optional budget alert email address."
  default     = null
}
