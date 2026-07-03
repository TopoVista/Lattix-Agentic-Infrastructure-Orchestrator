# Lattix Event Contracts

## Purpose

This document defines the initial event platform contract conventions for Lattix. It is the baseline for Kafka topics, event envelopes, schemas, retry rules, dead letter queues, idempotency, and event-driven integrations.

## Event Principles

- Events describe facts that happened, not commands that should happen.
- Commands may be modeled separately for workflow orchestration.
- Events must include tenant or workspace context when applicable.
- Events must include trace and correlation identifiers.
- Producers own event schemas.
- Consumers must be idempotent.
- Event contracts are versioned.
- Sensitive payloads must avoid secrets and minimize personal data.

## Topic Naming

```text
lattix.<domain>.<event-name>.v<major-version>
```

Examples:

- `lattix.workspace.created.v1`
- `lattix.repository.index-requested.v1`
- `lattix.agent.task-created.v1`
- `lattix.audit.event-recorded.v1`

## Standard Event Envelope

```json
{
  "id": "evt_123",
  "type": "repository.index_requested",
  "version": 1,
  "key": "repo_123",
  "tenantId": "tenant_123",
  "workspaceId": "workspace_123",
  "actor": {
    "type": "user",
    "id": "user_123"
  },
  "traceId": "trace_123",
  "correlationId": "corr_123",
  "causationId": "evt_previous",
  "occurredAt": "2026-07-02T12:00:00Z",
  "payload": {}
}
```

## Envelope Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Globally unique event id |
| `type` | Yes | Stable event type string |
| `version` | Yes | Major schema version |
| `key` | Yes | Ordering and partition key |
| `tenantId` | Contextual | Required for tenant-scoped facts |
| `workspaceId` | Contextual | Required for workspace-scoped facts |
| `actor` | Yes | User, service, agent, or system |
| `traceId` | Yes | Distributed trace id |
| `correlationId` | Yes | Workflow correlation id |
| `causationId` | Optional | Event or command that caused this event |
| `occurredAt` | Yes | Source timestamp |
| `payload` | Yes | Versioned event payload |

## Initial Topic Catalog

| Topic | Producer | Consumers | Key | Retention | Privacy Class |
| --- | --- | --- | --- | --- | --- |
| `lattix.auth.user-signed-in.v1` | auth-service | audit, analytics, security | userId | 30 days | personal |
| `lattix.workspace.created.v1` | workspace-service | notification, knowledge, analytics | workspaceId | 1 year | internal |
| `lattix.repository.registered.v1` | repository-service | indexer, knowledge, audit | repositoryId | 1 year | internal |
| `lattix.repository.index-requested.v1` | repository-service | repository-indexer | repositoryId | 30 days | internal |
| `lattix.repository.index-completed.v1` | repository-indexer | search, knowledge, memory, analytics | repositoryId | 1 year | internal |
| `lattix.document.imported.v1` | document-service | memory, knowledge, search | documentId | 1 year | confidential |
| `lattix.agent.task-created.v1` | agent-runtime | scheduler, audit, analytics | taskId | 1 year | internal |
| `lattix.agent.step-completed.v1` | agent-runtime | evaluation, memory, analytics, observability | taskId | 1 year | internal |
| `lattix.tool.invoked.v1` | tool-gateway | audit, security, analytics | invocationId | 1 year | confidential |
| `lattix.approval.requested.v1` | approval-service | notification, audit | approvalId | 1 year | confidential |
| `lattix.approval.decided.v1` | approval-service | agent-runtime, cloud-controller, audit | approvalId | 1 year | confidential |
| `lattix.pipeline.completed.v1` | cicd-platform | knowledge, ML, analytics, digital-twin | pipelineRunId | 1 year | internal |
| `lattix.deployment.completed.v1` | cicd-platform | observability, knowledge, digital-twin | deploymentId | 1 year | internal |
| `lattix.incident.created.v1` | monitoring-service | incident-agent, knowledge, notification | incidentId | 1 year | confidential |
| `lattix.cloud.action-planned.v1` | cloud-controller | approval, audit, cost, digital-twin | planId | 1 year | confidential |
| `lattix.cloud.action-executed.v1` | cloud-controller | audit, knowledge, digital-twin, observability | actionId | 1 year | confidential |
| `lattix.audit.event-recorded.v1` | audit-service | compliance, security, analytics | auditEventId | 7 years configurable | confidential |

## Core Event Payload Sketches

### Workspace Created

```json
{
  "workspaceId": "workspace_123",
  "tenantId": "tenant_123",
  "name": "Platform",
  "slug": "platform",
  "ownerUserId": "user_123"
}
```

### Repository Index Requested

```json
{
  "indexJobId": "job_123",
  "repositoryId": "repo_123",
  "branch": "main",
  "commit": "abc123",
  "scope": "full",
  "priority": "normal"
}
```

### Agent Task Created

```json
{
  "taskId": "task_123",
  "goal": "Plan a safe rollout for service api-gateway",
  "riskLevel": "medium",
  "requiredApprovals": [],
  "contextRefs": []
}
```

### Approval Decided

```json
{
  "approvalId": "approval_123",
  "decision": "approved",
  "decidedBy": "user_456",
  "decisionReason": "Reviewed plan and rollback path",
  "expiresAt": "2026-07-02T13:00:00Z"
}
```

### Cloud Action Planned

```json
{
  "planId": "plan_123",
  "provider": "aws",
  "environment": "staging",
  "action": "scale",
  "resourceType": "eks_deployment",
  "blastRadius": "single service",
  "estimatedCostChangeUsdMonthly": 42.5,
  "requiresApproval": true
}
```

## Retry And Dead Letter Rules

- Retry topics use suffix `.retry.<attempt>`.
- Dead letter topics use suffix `.dlq`.
- Consumers classify failures as transient, permanent, policy, poison, or unknown.
- Transient failures retry with exponential backoff.
- Permanent and policy failures go to DLQ with reason.
- DLQ growth triggers alerts and owner notifications.

## Idempotency

Consumers must store processed event IDs or deterministic idempotency keys for side-effecting handlers.

Idempotency key format:

```text
<consumer-group>:<event-id>
```

For replayable projections, consumers may use source aggregate version if available.

## Outbox Pattern

Transactional services that publish domain events must:

1. Persist state change and outbox event in one database transaction.
2. Let outbox publisher publish to Kafka.
3. Mark outbox record as published only after broker acknowledgement.
4. Retry unpublished records safely.

## Schema Evolution

- Additive optional fields are allowed in same major version.
- Removing fields, renaming fields, changing meaning, or changing type requires new major version.
- Consumers should ignore unknown fields.
- Producers must not emit secret values.

## Acceptance Criteria

- Initial events cover identity, workspace, repository, documents, agents, approvals, tools, CI/CD, deployments, incidents, cloud, and audit.
- Every event includes owner, key, retention, and privacy class.
- Retry, DLQ, outbox, and idempotency rules are defined before implementation.
