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

## Future Phase Dependencies

- Phase 3 defines cloud infrastructure.
- Phase 24 implements cloud controllers.
- Phase 33 implements multi-region deployment.
