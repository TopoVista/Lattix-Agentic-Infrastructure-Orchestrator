variable "environment" {
  type        = string
  description = "Environment profile selected by the thin root module."

  validation {
    condition     = contains(["local", "dev", "staging", "prod"], var.environment)
    error_message = "environment must be local, dev, staging, or prod."
  }
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

variable "github_repository" {
  type        = string
  description = "GitHub owner/repository trusted by AWS OIDC."
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

variable "budget_alert_email" {
  type        = string
  description = "Optional budget alert email address."
  default     = null
}
