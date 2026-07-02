variable "region" {
  type        = string
  description = "AWS region for Terraform state resources."
}

variable "state_bucket_name" {
  type        = string
  description = "Globally unique S3 bucket name for Terraform state."
}

variable "lock_table_name" {
  type        = string
  description = "DynamoDB state locking table name."
  default     = "lattix-terraform-locks"
}

variable "owner" {
  type        = string
  description = "Owning team."
}

variable "cost_center" {
  type        = string
  description = "Cost allocation identifier."
}
