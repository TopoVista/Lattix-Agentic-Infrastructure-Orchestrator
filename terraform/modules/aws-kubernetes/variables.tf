variable "name_prefix" {
  description = "Prefix used for EKS resource names."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnets used by the EKS control plane and nodes."
  type        = list(string)
}

variable "kms_key_arn" {
  description = "KMS key used to encrypt Kubernetes secrets."
  type        = string
}

variable "permissions_boundary_arn" {
  description = "Permissions boundary applied to EKS IAM roles."
  type        = string
}

variable "kubernetes_version" {
  description = "EKS Kubernetes minor version."
  type        = string
  default     = "1.31"
}

variable "endpoint_public_access" {
  description = "Expose the EKS API publicly in addition to its private endpoint."
  type        = bool
  default     = false
}

variable "public_access_cidrs" {
  description = "CIDRs allowed to access a public EKS endpoint."
  type        = list(string)
  default     = []
}

variable "node_instance_types" {
  description = "Allowed EC2 instance types for the general node group."
  type        = list(string)
  default     = ["m7i.large"]
}

variable "node_min_size" {
  type    = number
  default = 2
}

variable "node_desired_size" {
  type    = number
  default = 2
}

variable "node_max_size" {
  type    = number
  default = 6
}

variable "admin_principal_arns" {
  description = "IAM principals granted EKS cluster administrator access."
  type        = set(string)
  default     = []
}

variable "tags" {
  description = "Required ownership and cost allocation tags."
  type        = map(string)
}
