# Phase 24 - Cloud Controllers

## Goal

Build cloud controllers that let Lattix provision, deploy, scale, restart, rollback, delete, monitor, and repair resources across AWS, GCP, and Azure.

## Why This Phase Exists

Lattix should not only observe infrastructure; it should operate it through controlled automation. Cloud controllers convert cloud actions into policy-checked, auditable, reversible workflows with human approval for risky changes.

## Success Criteria

- Cloud controller framework supports AWS first and provider adapters for GCP and Azure.
- Actions are policy checked, simulated where possible, approved when risky, and audited.
- Controllers can provision, deploy, scale, restart, rollback, delete, monitor, and repair supported resources.
- Drift detection and reconciliation loops are defined.
- Cloud actions integrate with agents, Terraform, Kubernetes, observability, and digital twin data.

## Deliverables

- Cloud controller service.
- Provider adapter interfaces.
- AWS adapter implementation.
- GCP and Azure adapter stubs with contracts.
- Cloud action policy engine.
- Reconciliation and drift detection workflows.
- Runbooks for rollback and repair.

## Folder Structure

```text
cloud/
  controllers/
    service/
    providers/
      aws/
      gcp/
      azure/
    actions/
    policies/
    reconciliation/
    repair/
    audit/
shared/
  cloud-contracts/
```

## Modules To Build

- Controller API module.
- Provider abstraction module.
- AWS adapter module.
- GCP adapter module.
- Azure adapter module.
- Cloud action policy module.
- Reconciliation module.
- Repair module.
- Audit module.

## Functionality

- Execute cloud actions through typed requests.
- Support dry-run for provision, scale, delete, and policy changes where provider supports it.
- Require approval for destructive or production-impacting operations.
- Monitor resource state and compare desired versus actual state.
- Trigger repair workflows for unhealthy resources.
- Emit audit, cost, security, and digital twin update events.

## Tech Stack

- Spring Boot or FastAPI controller service.
- AWS SDK.
- GCP SDK.
- Azure SDK.
- Terraform plan integration.
- Kubernetes API integration.
- OpenTelemetry.
- Kafka.

## Implementation Plan

1. Define cloud resource, action, provider, region, account, environment, and approval contracts.
2. Implement controller API with validate, dry-run, execute, monitor, rollback, and audit endpoints.
3. Implement provider adapter interface with AWS implementation for common resources.
4. Add GCP and Azure adapters with no-op capability discovery and typed contracts.
5. Implement policy checks for environment, role, resource type, cost impact, data class, and destructive action.
6. Implement dry-run and plan capture for supported actions.
7. Implement reconciliation loop for desired versus observed state.
8. Implement repair workflow templates for restart, scale, rollback, and recreate operations.
9. Publish events for cloud action lifecycle and digital twin updates.

## Functions / Classes / Interfaces To Implement

```python
def validate_cloud_action(request: CloudActionRequest) -> CloudActionValidation:
    # Checks actor, provider, environment, resource, policy, cost, and required approvals.

def plan_cloud_action(request: CloudActionRequest) -> CloudActionPlan:
    # Produces dry-run changes, blast radius, rollback option, and approval metadata.

def execute_cloud_action(plan_id: str) -> CloudActionResult:
    # Executes an approved plan and records provider response, audit id, and observed state.

def reconcile_resource(request: ReconciliationRequest) -> ReconciliationReport:
    # Compares desired and actual state, detects drift, and proposes repair steps.

def repair_resource(request: RepairRequest) -> RepairResult:
    # Runs approved restart, rollback, scale, recreate, or provider-specific repair actions.
```

## Configuration / Environment Variables

- `CLOUD_CONTROLLER_PORT`
- `AWS_REGION`
- `AWS_ROLE_ARN`
- `GCP_PROJECT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `CLOUD_ACTION_APPROVAL_REQUIRED`
- `CLOUD_ACTION_DRY_RUN_REQUIRED`
- `CLOUD_RECONCILIATION_INTERVAL_SECONDS`

## Data Models / Schemas / Contracts

- `CloudActionRequest`: actor, workspaceId, provider, account, region, environment, resource, action, parameters.
- `CloudActionPlan`: id, validation, proposedChanges, blastRadius, rollbackPlan, approvals.
- `CloudActionResult`: planId, status, providerResult, observedState, auditId, events.
- `CloudResourceState`: provider, type, id, region, tags, status, configuration, lastSeenAt.
- `ReconciliationReport`: desired, actual, drift, risk, recommendedActions.

## Testing Plan

- Unit tests for policy and validation.
- Mock provider tests for each adapter.
- Dry-run tests for provision, scale, delete, and rollback actions.
- Approval tests for production and destructive operations.
- Reconciliation tests with desired and actual fixture states.

## Acceptance Criteria

- Cloud actions are never executed without validation.
- Risky actions require approval.
- AWS common actions work through the controller.
- GCP and Azure adapters have stable interfaces for later implementation.
- Every action is auditable and traceable.

## Risks And Mitigations

- Risk: automation damages infrastructure. Mitigation: dry-run, approval, blast radius, rollback, and least privilege.
- Risk: provider APIs differ significantly. Mitigation: provider adapter contracts with provider-specific capability discovery.
- Risk: drift detection causes noisy alerts. Mitigation: severity rules and reconciliation windows.

## Next Phase Handoff

Phase 25 should use cloud controllers and Kubernetes deployment conventions to build the CI/CD platform.
