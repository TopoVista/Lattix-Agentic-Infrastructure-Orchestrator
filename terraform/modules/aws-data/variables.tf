variable "name_prefix" {
  description = "Prefix used for managed data resource names."
  type        = string
}

variable "vpc_id" {
  description = "VPC containing managed data services."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR allowed to connect to managed data services."
  type        = string
}

variable "data_subnet_ids" {
  description = "Isolated subnet identifiers for managed data services."
  type        = list(string)
}

variable "database_instance_class" {
  description = "RDS PostgreSQL instance class."
  type        = string
  default     = "db.t4g.small"
}

variable "database_storage_gib" {
  description = "Initial RDS storage allocation."
  type        = number
  default     = 50
}

variable "database_multi_az" {
  description = "Enable RDS Multi-AZ failover."
  type        = bool
  default     = false
}

variable "database_deletion_protection" {
  description = "Protect the database from accidental deletion."
  type        = bool
  default     = true
}

variable "redis_node_type" {
  description = "ElastiCache Redis node type."
  type        = string
  default     = "cache.t4g.small"
}

variable "redis_replicas" {
  description = "Number of Redis read replicas."
  type        = number
  default     = 1
}

variable "enable_msk" {
  description = "Provision an MSK cluster."
  type        = bool
  default     = false
}

variable "msk_instance_type" {
  description = "MSK broker instance type."
  type        = string
  default     = "kafka.t3.small"
}

variable "ecr_repositories" {
  description = "Container repositories created for platform workloads."
  type        = set(string)
  default     = ["gateway", "backend", "ai-platform", "agents"]
}

variable "tags" {
  description = "Required ownership and cost allocation tags."
  type        = map(string)
}
