# Lattix API Design

## Purpose

This document defines initial API boundaries, conventions, resources, request patterns, and public contract expectations for Lattix.

## API Style

- REST over HTTPS for product APIs.
- Server-sent events or WebSockets for streaming chat, agent task progress, indexing progress, and pipeline progress.
- OpenAPI for public and service-facing REST contracts.
- JSON Schema for tool calls, agent state, approval payloads, and policy decisions.
- AsyncAPI for Kafka event contracts.

## API Entry Point

All external application traffic flows through the API gateway.

```text
https://api.<domain>/api/v1/<resource>
```

Internal service APIs may use cluster-local addresses, but must preserve trace, actor, workspace, and request context.

## Global API Conventions

### Authentication

- Protected endpoints require bearer access token.
- Gateway validates token issuer, audience, signature, expiration, and scopes.
- Services receive a normalized principal context.

### Versioning

- Public APIs use URL major versioning: `/api/v1`.
- Breaking changes require a new major version.
- Non-breaking additions may be added to existing versions.

### Request Headers

| Header | Required | Purpose |
| --- | --- | --- |
| `Authorization` | Yes for protected APIs | Bearer access token |
| `X-Lattix-Workspace-Id` | Usually | Workspace scope |
| `X-Request-Id` | Optional | Client request id; generated if absent |
| `X-Correlation-Id` | Optional | Multi-call workflow correlation |
| `Idempotency-Key` | For mutation retries | Safe retry key |

### Standard Success Shape

```json
{
  "requestId": "req_123",
  "timestamp": "2026-07-02T12:00:00Z",
  "data": {},
  "meta": {}
}
```

### Standard Error Shape

```json
{
  "requestId": "req_123",
  "timestamp": "2026-07-02T12:00:00Z",
  "code": "WORKSPACE_NOT_FOUND",
  "message": "Workspace was not found or is not accessible.",
  "details": {},
  "retryable": false
}
```

### Pagination

Cursor pagination is the default for list endpoints.

```json
{
  "items": [],
  "pageInfo": {
    "nextCursor": "cursor",
    "hasNextPage": true
  }
}
```

## Core API Resources

### Auth

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/auth/providers` | List enabled OAuth providers |
| `GET` | `/api/v1/auth/oauth/{provider}/start` | Start OAuth login |
| `POST` | `/api/v1/auth/oauth/{provider}/callback` | Complete OAuth callback |
| `POST` | `/api/v1/auth/token/refresh` | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | Revoke current session |
| `POST` | `/api/v1/auth/mfa/challenge` | Create MFA challenge |
| `POST` | `/api/v1/auth/mfa/verify` | Verify MFA challenge |

### Workspaces

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/workspaces` | Create workspace |
| `GET` | `/api/v1/workspaces` | List accessible workspaces |
| `GET` | `/api/v1/workspaces/{workspaceId}` | Get workspace details |
| `PATCH` | `/api/v1/workspaces/{workspaceId}` | Update workspace settings |
| `GET` | `/api/v1/workspaces/{workspaceId}/dashboard` | Get workspace dashboard |

### Repositories

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/repositories` | Register repository |
| `GET` | `/api/v1/repositories` | List repositories |
| `GET` | `/api/v1/repositories/{repositoryId}` | Get repository metadata |
| `POST` | `/api/v1/repositories/{repositoryId}/index-jobs` | Start indexing |
| `GET` | `/api/v1/repositories/{repositoryId}/tree` | List files and folders |
| `GET` | `/api/v1/repositories/{repositoryId}/file` | Read file content |

### Code Intelligence

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/code/symbols` | Search symbols |
| `GET` | `/api/v1/code/references` | Search references |
| `GET` | `/api/v1/code/graphs/call` | Query call graph |
| `GET` | `/api/v1/code/graphs/dependencies` | Query dependency graph |
| `POST` | `/api/v1/code/rename/preview` | Preview rename impact |
| `POST` | `/api/v1/code/completions` | Request AI code proposal |

### Chat

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/chat/conversations` | Create conversation |
| `GET` | `/api/v1/chat/conversations` | List conversations |
| `GET` | `/api/v1/chat/conversations/{conversationId}` | Get conversation |
| `POST` | `/api/v1/chat/conversations/{conversationId}/messages` | Send message |
| `GET` | `/api/v1/chat/conversations/{conversationId}/stream` | Stream response events |

### Agents

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/agents/tasks` | Create agent task |
| `GET` | `/api/v1/agents/tasks` | List agent tasks |
| `GET` | `/api/v1/agents/tasks/{taskId}` | Get task state |
| `POST` | `/api/v1/agents/tasks/{taskId}/cancel` | Cancel task |
| `GET` | `/api/v1/agents/tasks/{taskId}/events` | Stream task events |

### Approvals

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/approvals` | List pending approvals |
| `GET` | `/api/v1/approvals/{approvalId}` | Get approval details |
| `POST` | `/api/v1/approvals/{approvalId}/approve` | Approve action |
| `POST` | `/api/v1/approvals/{approvalId}/reject` | Reject action |

### Tools

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/tools` | List available tools |
| `POST` | `/api/v1/tools/{toolName}/invoke` | Invoke approved tool |
| `GET` | `/api/v1/tools/invocations/{invocationId}` | Get invocation result |

### Digital Twin

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/digital-twin/scenarios` | Create what-if scenario |
| `GET` | `/api/v1/digital-twin/scenarios/{scenarioId}` | Get scenario result |
| `POST` | `/api/v1/digital-twin/impact` | Run impact analysis |

### Cloud Actions

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/cloud/actions/validate` | Validate cloud action |
| `POST` | `/api/v1/cloud/actions/plan` | Create plan |
| `POST` | `/api/v1/cloud/actions/{planId}/execute` | Execute approved plan |
| `GET` | `/api/v1/cloud/resources` | List known resources |

### Audit

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/audit/events` | Search audit events |
| `POST` | `/api/v1/audit/exports` | Create audit export |
| `GET` | `/api/v1/audit/exports/{exportId}` | Get export status |

## Streaming Event Shape

```json
{
  "eventId": "evt_123",
  "type": "agent.step.completed",
  "timestamp": "2026-07-02T12:00:00Z",
  "traceId": "trace_123",
  "payload": {}
}
```

## Idempotency Rules

- Mutating endpoints that may be retried should accept `Idempotency-Key`.
- The platform stores request hash and result for the key within a configured window.
- If a repeated key has a different request hash, return `IDEMPOTENCY_KEY_CONFLICT`.

## Authorization Rules

- Gateway performs coarse authentication and scope checks.
- Services perform resource-level authorization.
- High-risk actions require approval even if the user has permission.
- Agents never receive raw user credentials.

## API Acceptance Criteria

- Every API has owner, auth mode, workspace scope, request schema, response schema, and error model.
- APIs preserve trace and audit context.
- Public contract changes are versioned.
- Risky mutations expose validate or plan endpoints before execute endpoints.
