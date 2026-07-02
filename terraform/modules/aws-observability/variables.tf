variable "name_prefix" {
  type        = string
  description = "Prefix used for observability resources."
}

variable "kms_key_arn" {
  type        = string
  description = "KMS key used to encrypt logs and notifications."
}

variable "monthly_budget_usd" {
  type        = number
  description = "Monthly environment budget in USD."
  default     = 500
}

variable "budget_alert_email" {
  type        = string
  description = "Optional email subscriber for budget alerts."
  default     = null
}

variable "log_retention_days" {
  type        = number
  description = "CloudWatch application log retention."
  default     = 90
}

variable "tags" {
  type        = map(string)
  description = "Required ownership and cost allocation tags."
}
