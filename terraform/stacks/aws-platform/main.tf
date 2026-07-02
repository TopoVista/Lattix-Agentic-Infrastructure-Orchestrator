module "context" {
  source = "../../modules/provider-abstractions"

  project_name    = var.project_name
  environment     = var.environment
  region          = var.region
  owner           = var.owner
  cost_center     = var.cost_center
  additional_tags = var.additional_tags
}

module "aws_network" {
  source = "../../modules/aws-network"

  name_prefix        = module.context.context.name_prefix
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  nat_gateway_count  = var.nat_gateway_count
  tags               = module.context.context.tags
}

module "aws_identity" {
  source = "../../modules/aws-identity"

  name_prefix             = module.context.context.name_prefix
  github_repository       = var.github_repository
  operator_principal_arns = var.operator_principal_arns
  ci_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser",
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  ]
  tags = module.context.context.tags
}

module "aws_data" {
  source = "../../modules/aws-data"

  name_prefix                  = module.context.context.name_prefix
  vpc_id                       = module.aws_network.vpc_id
  vpc_cidr                     = module.aws_network.vpc_cidr
  data_subnet_ids              = module.aws_network.data_subnet_ids
  database_instance_class      = var.database_instance_class
  database_multi_az            = var.database_multi_az
  database_deletion_protection = var.database_deletion_protection
  redis_node_type              = var.redis_node_type
  redis_replicas               = var.redis_replicas
  enable_msk                   = var.enable_msk
  tags                         = module.context.context.tags
}

module "aws_kubernetes" {
  source = "../../modules/aws-kubernetes"

  name_prefix              = module.context.context.name_prefix
  private_subnet_ids       = module.aws_network.private_subnet_ids
  kms_key_arn              = module.aws_data.kms_key_arn
  permissions_boundary_arn = module.aws_identity.permissions_boundary_arn
  kubernetes_version       = var.kubernetes_version
  endpoint_public_access   = var.eks_endpoint_public_access
  public_access_cidrs      = var.eks_public_access_cidrs
  node_instance_types      = var.node_instance_types
  node_min_size            = var.node_min_size
  node_desired_size        = var.node_desired_size
  node_max_size            = var.node_max_size
  admin_principal_arns     = setunion(var.admin_principal_arns, toset([module.aws_identity.operator_role_arn]))
  tags                     = module.context.context.tags
}

module "aws_edge" {
  source = "../../modules/aws-edge"

  name_prefix                = module.context.context.name_prefix
  vpc_id                     = module.aws_network.vpc_id
  public_subnet_ids          = module.aws_network.public_subnet_ids
  domain_name                = var.domain_name
  hosted_zone_id             = var.hosted_zone_id
  alb_certificate_arn        = var.alb_certificate_arn
  cloudfront_certificate_arn = var.cloudfront_certificate_arn
  enable_cloudfront          = var.enable_cloudfront
  enable_deletion_protection = var.edge_deletion_protection
  tags                       = module.context.context.tags
}

module "aws_observability" {
  source = "../../modules/aws-observability"

  name_prefix        = module.context.context.name_prefix
  kms_key_arn        = module.aws_data.kms_key_arn
  monthly_budget_usd = var.monthly_budget_usd
  budget_alert_email = var.budget_alert_email
  tags               = module.context.context.tags
}
