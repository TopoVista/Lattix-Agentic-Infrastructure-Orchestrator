locals {
  name_prefix = "${var.project_name}-${var.environment}"
  required_tags = {
    Project     = var.project_name
    Environment = var.environment
    Owner       = var.owner
    CostCenter  = var.cost_center
    ManagedBy   = "terraform"
    Repository  = "lattix"
  }
  tags = merge(local.required_tags, var.additional_tags)
}
