output "kms_key_arn" {
  description = "KMS key used by managed platform data."
  value       = aws_kms_key.data.arn
}

output "artifact_bucket_name" {
  description = "Encrypted artifact bucket name."
  value       = aws_s3_bucket.artifacts.id
}

output "ecr_repository_urls" {
  description = "Container repository URLs keyed by workload name."
  value       = { for name, repository in aws_ecr_repository.this : name => repository.repository_url }
}

output "secret_arn" {
  description = "Runtime secret namespace ARN."
  value       = aws_secretsmanager_secret.platform.arn
}

output "postgres" {
  description = "PostgreSQL connection contract; credentials remain in the RDS-managed secret."
  value = {
    endpoint          = aws_db_instance.postgres.address
    port              = aws_db_instance.postgres.port
    database          = aws_db_instance.postgres.db_name
    master_secret_arn = try(aws_db_instance.postgres.master_user_secret[0].secret_arn, null)
    security_group_id = aws_security_group.postgres.id
  }
  sensitive = true
}

output "redis" {
  description = "Redis connection contract."
  value = {
    endpoint          = aws_elasticache_replication_group.redis.primary_endpoint_address
    port              = aws_elasticache_replication_group.redis.port
    security_group_id = aws_security_group.redis.id
  }
}

output "kafka" {
  description = "Kafka IAM/TLS bootstrap contract, or null when MSK is disabled."
  value = var.enable_msk ? {
    bootstrap_brokers = aws_msk_cluster.this[0].bootstrap_brokers_sasl_iam
    cluster_arn       = aws_msk_cluster.this[0].arn
  } : null
}
