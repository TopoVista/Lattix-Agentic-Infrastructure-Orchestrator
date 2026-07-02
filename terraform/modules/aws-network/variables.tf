variable "name_prefix" {
  description = "Prefix used for network resource names."
  type        = string
}

variable "vpc_cidr" {
  description = "IPv4 CIDR allocated to the environment VPC."
  type        = string

  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "vpc_cidr must be a valid IPv4 CIDR."
  }
}

variable "availability_zones" {
  description = "Availability zones used for public, private, and data subnet tiers."
  type        = list(string)

  validation {
    condition     = length(var.availability_zones) >= 2
    error_message = "At least two availability zones are required."
  }
}

variable "nat_gateway_count" {
  description = "Number of NAT gateways; use one for dev and one per AZ for production."
  type        = number
  default     = 1

  validation {
    condition     = var.nat_gateway_count >= 1 && var.nat_gateway_count <= length(var.availability_zones)
    error_message = "nat_gateway_count must be between one and the availability zone count."
  }
}

variable "enable_interface_endpoints" {
  description = "Create private endpoints for AWS control-plane services."
  type        = bool
  default     = true
}

variable "tags" {
  description = "Required ownership and cost allocation tags."
  type        = map(string)
}
