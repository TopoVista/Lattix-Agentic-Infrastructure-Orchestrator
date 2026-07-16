# Cloud

## Purpose

Contains cloud provider adapters, cloud controller code, provider abstractions, and operational cloud workflows.

## Owner Type

Platform engineering.

## Conventions

- Cloud write operations are plan-first and approval-gated.
- Provider credentials must be referenced, not embedded.
- Cloud resources must be tagged with project, environment, owner, cost center, and data class.
- AWS is primary first; GCP and Azure use adapter boundaries.

## Implemented Package

`cloud/controllers/lattix_cloud_controllers` implements the Phase 24 controller surface:

- `validate_cloud_action` checks actor role, provider, environment, resource tags, data class, cost impact, destructive action, approval, and dry-run policy.
- `plan_cloud_action` captures provider dry-run changes, blast radius, rollback metadata, and approval state before any write.
- `execute_cloud_action` runs only validated ready plans, records provider response, observed state, audit id, and lifecycle events.
- `reconcile_resource` compares desired and actual state for drift and recommends repair actions.
- `repair_resource` runs approved restart, rollback, scale, recreate, or provider-specific repair workflows.

AWS has a deterministic local adapter for common resource actions. GCP and Azure expose stable contract-only adapters with capability discovery.

## Environment Variables

- `CLOUD_CONTROLLER_PORT`
- `AWS_REGION`
- `AWS_ROLE_ARN`
- `GCP_PROJECT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `CLOUD_ACTION_APPROVAL_REQUIRED`
- `CLOUD_ACTION_DRY_RUN_REQUIRED`
- `CLOUD_RECONCILIATION_INTERVAL_SECONDS`

## Future Phase Dependencies

- Phase 3 defines cloud infrastructure.
- Phase 24 implements cloud controllers.
- Phase 33 implements multi-region deployment.
