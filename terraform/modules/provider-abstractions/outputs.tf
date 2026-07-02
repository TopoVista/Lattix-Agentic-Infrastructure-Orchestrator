output "context" {
  description = "Provider-neutral environment contract consumed by cloud modules."
  value = {
    project_name = var.project_name
    environment  = var.environment
    region       = var.region
    name_prefix  = local.name_prefix
    tags         = local.tags
  }
}
