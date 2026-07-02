output "vpc_id" {
  description = "Environment VPC identifier."
  value       = aws_vpc.this.id
}

output "vpc_cidr" {
  description = "Environment VPC CIDR."
  value       = aws_vpc.this.cidr_block
}

output "public_subnet_ids" {
  description = "Public subnet identifiers for internet-facing load balancers."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet identifiers for Kubernetes workloads."
  value       = aws_subnet.private[*].id
}

output "data_subnet_ids" {
  description = "Isolated subnet identifiers for managed data stores."
  value       = aws_subnet.data[*].id
}

output "route_table_ids" {
  description = "Route table identifiers grouped by network tier."
  value = {
    public  = [aws_route_table.public.id]
    private = aws_route_table.private[*].id
    data    = aws_route_table.data[*].id
  }
}

output "endpoint_security_group_id" {
  description = "Security group attached to private interface endpoints."
  value       = aws_security_group.endpoints.id
}
