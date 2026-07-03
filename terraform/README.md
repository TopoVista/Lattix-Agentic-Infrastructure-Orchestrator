# Terraform

## Purpose

Contains Terraform environments, modules, provider configuration, state conventions, and infrastructure documentation.

## Owner Type

Platform engineering.

## Conventions

- Use reusable modules under `terraform/modules/`.
- Use environment roots under `terraform/environments/`.
- Never commit state, plans containing secrets, or tfvars with credentials.
- Every managed resource must have required tags.
- Destructive plans require approval before apply.

## Future Phase Dependencies

- Phase 3 implements AWS-first infrastructure modules.
- Phase 24 integrates Terraform plans with cloud controllers.
- Phase 32 adds DR for Terraform state.
