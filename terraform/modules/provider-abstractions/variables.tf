variable "project_name" {
  description = "Stable project identifier used in names and tags."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{1,30}$", var.project_name))
    error_message = "project_name must be a lowercase DNS-compatible name."
  }
}

variable "environment" {
  description = "Deployment environment boundary."
  type        = string

  validation {
    condition     = contains(["local", "dev", "staging", "prod"], var.environment)
    error_message = "environment must be local, dev, staging, or prod."
  }
}

variable "region" {
  description = "Primary cloud region."
  type        = string
}

variable "owner" {
  description = "Team responsible for the environment."
  type        = string
}

variable "cost_center" {
  description = "Cost allocation identifier."
  type        = string
}

variable "additional_tags" {
  description = "Additional provider-specific resource tags."
  type        = map(string)
  default     = {}
}
