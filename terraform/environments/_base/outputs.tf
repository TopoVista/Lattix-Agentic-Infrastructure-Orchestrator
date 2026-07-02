output "context" {
  value = module.platform.context
}

output "network" {
  value = module.platform.network
}

output "identity" {
  value = module.platform.identity
}

output "data" {
  value     = module.platform.data
  sensitive = true
}

output "cluster" {
  value     = module.platform.cluster
  sensitive = true
}

output "edge" {
  value = module.platform.edge
}

output "observability" {
  value = module.platform.observability
}
