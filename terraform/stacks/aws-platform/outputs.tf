output "context" {
  description = "Normalized cloud environment context."
  value       = module.context.context
}

output "network" {
  description = "Network outputs consumed by Kubernetes and managed services."
  value = {
    vpc_id             = module.aws_network.vpc_id
    public_subnet_ids  = module.aws_network.public_subnet_ids
    private_subnet_ids = module.aws_network.private_subnet_ids
    data_subnet_ids    = module.aws_network.data_subnet_ids
    route_table_ids    = module.aws_network.route_table_ids
  }
}

output "identity" {
  description = "Platform identity outputs."
  value = {
    permissions_boundary_arn = module.aws_identity.permissions_boundary_arn
    ci_role_arn              = module.aws_identity.ci_role_arn
    operator_role_arn        = module.aws_identity.operator_role_arn
  }
}

output "data" {
  description = "Managed data service contracts."
  value = {
    kms_key_arn          = module.aws_data.kms_key_arn
    artifact_bucket_name = module.aws_data.artifact_bucket_name
    ecr_repository_urls  = module.aws_data.ecr_repository_urls
    secret_arn           = module.aws_data.secret_arn
    postgres             = module.aws_data.postgres
    redis                = module.aws_data.redis
    kafka                = module.aws_data.kafka
  }
  sensitive = true
}

output "cluster" {
  description = "EKS cluster connection contract."
  value       = module.aws_kubernetes.cluster
  sensitive   = true
}

output "edge" {
  description = "Public edge contract."
  value       = module.aws_edge.edge
}

output "observability" {
  description = "CloudWatch and alerting contract."
  value = {
    alerts_topic_arn = module.aws_observability.alerts_topic_arn
    log_group_names  = module.aws_observability.log_group_names
    dashboard_name   = module.aws_observability.dashboard_name
  }
}
