# Terraform Runbook

## Bootstrap

1. Apply `terraform/bootstrap` once from a secured administrator session.
2. Copy its output into each environment's `backend.hcl` based on `backend.hcl.example`.
3. Store environment values in an uncommitted `terraform.tfvars` or approved CI environment secret.

## Validate And Plan

Run `scripts/infra/terraform-validate.ps1` for formatting and static validation. Run `scripts/infra/terraform-plan.ps1 -Environment dev` to initialize remote state and create a saved plan.

Production applies require protected GitHub Environment approval, a reviewed saved plan, and a verified rollback or restore path. Never edit cloud resources manually except during an incident; import emergency changes back into Terraform immediately afterward.
