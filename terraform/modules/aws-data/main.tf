resource "aws_kms_key" "data" {
  description             = "${var.name_prefix} managed data encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  tags                    = merge(var.tags, { Name = "${var.name_prefix}-data" })
}

resource "aws_kms_alias" "data" {
  name          = "alias/${var.name_prefix}-data"
  target_key_id = aws_kms_key.data.key_id
}

resource "aws_s3_bucket" "artifacts" {
  bucket_prefix = "${var.name_prefix}-artifacts-"
  force_destroy = false
  tags          = merge(var.tags, { Name = "${var.name_prefix}-artifacts" })
}

resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.data.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    id     = "expire-incomplete-uploads"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }

  depends_on = [aws_s3_bucket_versioning.artifacts]
}

resource "aws_ecr_repository" "this" {
  for_each = var.ecr_repositories

  name                 = "${var.name_prefix}/${each.value}"
  image_tag_mutability = "IMMUTABLE"
  force_delete         = false

  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = aws_kms_key.data.arn
  }

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "this" {
  for_each = aws_ecr_repository.this

  repository = each.value.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Remove untagged images after 14 days"
      selection = {
        tagStatus   = "untagged"
        countType   = "sinceImagePushed"
        countUnit   = "days"
        countNumber = 14
      }
      action = { type = "expire" }
    }]
  })
}

resource "aws_secretsmanager_secret" "platform" {
  name                    = "${var.name_prefix}/platform"
  description             = "Runtime secret namespace populated by deployment automation"
  kms_key_id              = aws_kms_key.data.arn
  recovery_window_in_days = 30
  tags                    = var.tags
}

resource "aws_security_group" "postgres" {
  name        = "${var.name_prefix}-postgres"
  description = "PostgreSQL access from private workloads"
  vpc_id      = var.vpc_id
  tags        = merge(var.tags, { Name = "${var.name_prefix}-postgres" })
}

resource "aws_vpc_security_group_ingress_rule" "postgres" {
  security_group_id = aws_security_group.postgres.id
  cidr_ipv4         = var.vpc_cidr
  from_port         = 5432
  to_port           = 5432
  ip_protocol       = "tcp"
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.name_prefix}-postgres"
  subnet_ids = var.data_subnet_ids
  tags       = var.tags
}

resource "aws_db_instance" "postgres" {
  identifier = "${var.name_prefix}-postgres"

  engine                          = "postgres"
  engine_version                  = "16"
  instance_class                  = var.database_instance_class
  allocated_storage               = var.database_storage_gib
  max_allocated_storage           = var.database_storage_gib * 4
  storage_type                    = "gp3"
  storage_encrypted               = true
  kms_key_id                      = aws_kms_key.data.arn
  db_name                         = "lattix"
  username                        = "lattix_admin"
  manage_master_user_password     = true
  db_subnet_group_name            = aws_db_subnet_group.this.name
  vpc_security_group_ids          = [aws_security_group.postgres.id]
  publicly_accessible             = false
  multi_az                        = var.database_multi_az
  backup_retention_period         = var.database_multi_az ? 30 : 7
  deletion_protection             = var.database_deletion_protection
  skip_final_snapshot             = false
  final_snapshot_identifier       = "${var.name_prefix}-postgres-final"
  auto_minor_version_upgrade      = true
  performance_insights_enabled    = true
  performance_insights_kms_key_id = aws_kms_key.data.arn
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  copy_tags_to_snapshot           = true
  tags                            = var.tags
}

resource "aws_security_group" "redis" {
  name        = "${var.name_prefix}-redis"
  description = "Redis access from private workloads"
  vpc_id      = var.vpc_id
  tags        = merge(var.tags, { Name = "${var.name_prefix}-redis" })
}

resource "aws_vpc_security_group_ingress_rule" "redis" {
  security_group_id = aws_security_group.redis.id
  cidr_ipv4         = var.vpc_cidr
  from_port         = 6379
  to_port           = 6379
  ip_protocol       = "tcp"
}

resource "aws_elasticache_subnet_group" "this" {
  name       = "${var.name_prefix}-redis"
  subnet_ids = var.data_subnet_ids
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.name_prefix}-redis"
  description                = "Lattix distributed cache and session store"
  node_type                  = var.redis_node_type
  port                       = 6379
  parameter_group_name       = "default.redis7.cluster.on"
  engine_version             = "7.1"
  num_node_groups            = 1
  replicas_per_node_group    = var.redis_replicas
  automatic_failover_enabled = var.redis_replicas > 0
  multi_az_enabled           = var.redis_replicas > 0
  subnet_group_name          = aws_elasticache_subnet_group.this.name
  security_group_ids         = [aws_security_group.redis.id]
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  kms_key_id                 = aws_kms_key.data.arn
  snapshot_retention_limit   = 7
  apply_immediately          = false
  tags                       = var.tags
}

resource "aws_security_group" "msk" {
  count = var.enable_msk ? 1 : 0

  name        = "${var.name_prefix}-msk"
  description = "Kafka access from private workloads"
  vpc_id      = var.vpc_id
  tags        = merge(var.tags, { Name = "${var.name_prefix}-msk" })
}

resource "aws_vpc_security_group_ingress_rule" "msk" {
  count = var.enable_msk ? 1 : 0

  security_group_id = aws_security_group.msk[0].id
  cidr_ipv4         = var.vpc_cidr
  from_port         = 9098
  to_port           = 9098
  ip_protocol       = "tcp"
}

resource "aws_msk_configuration" "this" {
  count = var.enable_msk ? 1 : 0

  name              = "${var.name_prefix}-msk"
  kafka_versions    = ["3.7.x"]
  server_properties = <<-PROPERTIES
    auto.create.topics.enable=false
    default.replication.factor=3
    min.insync.replicas=2
    num.partitions=6
  PROPERTIES
}

resource "aws_msk_cluster" "this" {
  count = var.enable_msk ? 1 : 0

  cluster_name           = "${var.name_prefix}-msk"
  kafka_version          = "3.7.x"
  number_of_broker_nodes = length(var.data_subnet_ids)

  broker_node_group_info {
    instance_type   = var.msk_instance_type
    client_subnets  = var.data_subnet_ids
    security_groups = [aws_security_group.msk[0].id]

    storage_info {
      ebs_storage_info {
        volume_size = 100
      }
    }
  }

  client_authentication {
    sasl {
      iam = true
    }
  }

  encryption_info {
    encryption_at_rest_kms_key_arn = aws_kms_key.data.arn
    encryption_in_transit {
      client_broker = "TLS"
      in_cluster    = true
    }
  }

  configuration_info {
    arn      = aws_msk_configuration.this[0].arn
    revision = aws_msk_configuration.this[0].latest_revision
  }

  enhanced_monitoring = "PER_BROKER"
  tags                = var.tags
}
