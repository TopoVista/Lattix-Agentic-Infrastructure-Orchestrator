variable "name_prefix" {
  description = "Prefix used for IAM resource names."
  type        = string
}

variable "github_repository" {
  description = "GitHub owner/repository allowed to assume the CI role; null disables GitHub OIDC."
  type        = string
  default     = null
}

variable "github_branches" {
  description = "Git refs trusted by the CI role."
  type        = list(string)
  default     = ["refs/heads/main"]
}

variable "operator_principal_arns" {
  description = "IAM principals allowed to assume the operator role."
  type        = list(string)
  default     = []
}

variable "ci_policy_arns" {
  description = "Managed policies attached to the CI role."
  type        = set(string)
  default     = []
}

variable "tags" {
  description = "Required ownership and cost allocation tags."
  type        = map(string)
}
