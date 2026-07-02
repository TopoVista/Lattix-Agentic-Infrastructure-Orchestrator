terraform {
  required_version = ">= 1.8.0"
  backend "s3" {}
  required_providers {
    aws = { source = "hashicorp/aws", version = ">= 5.80, < 7.0" }
  }
}

variable "settings" {
  description = "Cloud environment settings and external integration identifiers."
  type = object({
    region                     = string
    owner                      = string
    cost_center                = string
    github_repository          = optional(string)
    operator_principal_arns    = optional(list(string), [])
    admin_principal_arns       = optional(set(string), [])
    domain_name                = optional(string)
    hosted_zone_id             = optional(string)
    alb_certificate_arn        = optional(string)
    cloudfront_certificate_arn = optional(string)
    budget_alert_email         = optional(string)
  })
}

provider "aws" { region = var.settings.region }

module "environment" {
  source = "../_base"

  environment                = "staging"
  region                     = var.settings.region
  owner                      = var.settings.owner
  cost_center                = var.settings.cost_center
  github_repository          = var.settings.github_repository
  operator_principal_arns    = var.settings.operator_principal_arns
  admin_principal_arns       = var.settings.admin_principal_arns
  domain_name                = var.settings.domain_name
  hosted_zone_id             = var.settings.hosted_zone_id
  alb_certificate_arn        = var.settings.alb_certificate_arn
  cloudfront_certificate_arn = var.settings.cloudfront_certificate_arn
  budget_alert_email         = var.settings.budget_alert_email
}

output "platform" {
  value     = module.environment
  sensitive = true
}
