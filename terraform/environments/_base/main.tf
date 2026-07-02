data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  profiles = {
    local = {
      vpc_cidr                     = "10.10.0.0/16"
      availability_zone_count      = 2
      nat_gateway_count            = 1
      database_instance_class      = "db.t4g.micro"
      database_multi_az            = false
      database_deletion_protection = false
      redis_node_type              = "cache.t4g.micro"
      redis_replicas               = 0
      enable_msk                   = false
      node_instance_types          = ["t3.large"]
      node_min_size                = 1
      node_desired_size            = 1
      node_max_size                = 2
      enable_cloudfront            = false
      edge_deletion_protection     = false
      monthly_budget_usd           = 100
    }
    dev = {
      vpc_cidr                     = "10.20.0.0/16"
      availability_zone_count      = 2
      nat_gateway_count            = 1
      database_instance_class      = "db.t4g.small"
      database_multi_az            = false
      database_deletion_protection = true
      redis_node_type              = "cache.t4g.small"
      redis_replicas               = 1
      enable_msk                   = false
      node_instance_types          = ["m7i.large"]
      node_min_size                = 2
      node_desired_size            = 2
      node_max_size                = 4
      enable_cloudfront            = false
      edge_deletion_protection     = false
      monthly_budget_usd           = 500
    }
    staging = {
      vpc_cidr                     = "10.30.0.0/16"
      availability_zone_count      = 3
      nat_gateway_count            = 1
      database_instance_class      = "db.m7g.large"
      database_multi_az            = true
      database_deletion_protection = true
      redis_node_type              = "cache.m7g.large"
      redis_replicas               = 2
      enable_msk                   = true
      node_instance_types          = ["m7i.large"]
      node_min_size                = 3
      node_desired_size            = 3
      node_max_size                = 9
      enable_cloudfront            = true
      edge_deletion_protection     = true
      monthly_budget_usd           = 2500
    }
    prod = {
      vpc_cidr                     = "10.40.0.0/16"
      availability_zone_count      = 3
      nat_gateway_count            = 3
      database_instance_class      = "db.r7g.xlarge"
      database_multi_az            = true
      database_deletion_protection = true
      redis_node_type              = "cache.r7g.large"
      redis_replicas               = 2
      enable_msk                   = true
      node_instance_types          = ["m7i.xlarge"]
      node_min_size                = 6
      node_desired_size            = 6
      node_max_size                = 24
      enable_cloudfront            = true
      edge_deletion_protection     = true
      monthly_budget_usd           = 10000
    }
  }

  profile = local.profiles[var.environment]
}

module "platform" {
  source = "../../stacks/aws-platform"

  project_name                 = "lattix"
  environment                  = var.environment
  region                       = var.region
  owner                        = var.owner
  cost_center                  = var.cost_center
  vpc_cidr                     = local.profile.vpc_cidr
  availability_zones           = slice(data.aws_availability_zones.available.names, 0, local.profile.availability_zone_count)
  nat_gateway_count            = local.profile.nat_gateway_count
  github_repository            = var.github_repository
  operator_principal_arns      = var.operator_principal_arns
  admin_principal_arns         = var.admin_principal_arns
  database_instance_class      = local.profile.database_instance_class
  database_multi_az            = local.profile.database_multi_az
  database_deletion_protection = local.profile.database_deletion_protection
  redis_node_type              = local.profile.redis_node_type
  redis_replicas               = local.profile.redis_replicas
  enable_msk                   = local.profile.enable_msk
  node_instance_types          = local.profile.node_instance_types
  node_min_size                = local.profile.node_min_size
  node_desired_size            = local.profile.node_desired_size
  node_max_size                = local.profile.node_max_size
  domain_name                  = var.domain_name
  hosted_zone_id               = var.hosted_zone_id
  alb_certificate_arn          = var.alb_certificate_arn
  cloudfront_certificate_arn   = var.cloudfront_certificate_arn
  enable_cloudfront            = local.profile.enable_cloudfront
  edge_deletion_protection     = local.profile.edge_deletion_protection
  monthly_budget_usd           = local.profile.monthly_budget_usd
  budget_alert_email           = var.budget_alert_email
}
