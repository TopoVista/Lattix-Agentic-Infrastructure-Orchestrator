output "permissions_boundary_arn" {
  description = "Permissions boundary required on Lattix-created IAM roles."
  value       = aws_iam_policy.permissions_boundary.arn
}

output "ci_role_arn" {
  description = "GitHub Actions role ARN, or null when OIDC is disabled."
  value       = try(aws_iam_role.ci[0].arn, null)
}

output "operator_role_arn" {
  description = "Human operator role ARN."
  value       = aws_iam_role.operator.arn
}
