# Phase 17 - MCP Tool Ecosystem

## Goal

Build Lattix Model Context Protocol tooling so agents can connect to external developer, communication, cloud, design, and operations systems.

## Why This Phase Exists

Agents become useful when they can inspect and act across the systems engineers already use. The tool ecosystem must be governed, audited, scoped, and approval-aware so integrations do not become unsafe backdoors.

## Success Criteria

- MCP server framework and tool registry are defined.
- Connectors are planned for GitHub, GitLab, Jira, Slack, Discord, Gmail, Outlook, Google Calendar, Google Drive, OneDrive, Dropbox, Figma, Docker, Kubernetes, Terraform, Jenkins, ArgoCD, SonarQube, and Sentry.
- Tool calls include auth, workspace scope, rate limits, audit logs, and risk classification.
- Secrets are stored through the platform secret system.

## Deliverables

- MCP server runtime.
- Tool registry and manifest format.
- Connector adapter interfaces.
- OAuth and token storage contracts.
- Tool permission policies.
- Integration test harness.

## Folder Structure

```text
agents/
  tool-agent/
mcp/
  server/
  registry/
  connectors/
    github/
    gitlab/
    jira/
    slack/
    discord/
    gmail/
    outlook/
    calendar/
    drive/
    figma/
    docker/
    kubernetes/
    terraform/
    jenkins/
    argocd/
    sonarqube/
    sentry/
shared/
  tool-contracts/
```

## Modules To Build

- MCP runtime module.
- Tool registry module.
- Connector auth module.
- Permission and policy module.
- Audit module.
- Rate limit module.
- Connector modules for each external system.
- Test harness module.

## Functionality

- Register tools with name, description, input schema, output schema, permissions, risk, and approval requirements.
- Execute tool calls through a central gateway.
- Validate tool inputs and redact sensitive outputs.
- Support user-connected and workspace-connected credentials.
- Enforce per-tool rate limits.
- Log all tool invocations and outcomes.

## Tech Stack

- Model Context Protocol.
- FastAPI or Node runtime for MCP server.
- JSON Schema for tool inputs and outputs.
- OAuth for SaaS connectors.
- Kubernetes client libraries.
- Terraform CLI wrapper with plan-only default.
- Docker SDK.

## Implementation Plan

1. Define tool manifest schema and registry storage.
2. Implement MCP server runtime with tool discovery and invocation.
3. Implement tool gateway policy checks for permissions, scopes, rate limits, and risk.
4. Implement credential references without exposing secret values to agents.
5. Implement read-only GitHub, Jira, Slack, Kubernetes, Docker, Terraform, and Sentry starter tools.
6. Add write-capable tools only behind explicit approval policies.
7. Add connector test harness with mocked external APIs.
8. Add audit and telemetry for every tool call.

## Functions / Classes / Interfaces To Implement

```python
def register_tool(manifest: ToolManifest) -> RegisteredTool:
    # Validates schema, permissions, risk level, owner, and connector before publishing a tool.

def invoke_tool(request: ToolInvocationRequest) -> ToolInvocationResult:
    # Runs permission checks, resolves credentials, executes connector call, redacts output, and audits result.

def resolve_tool_credentials(request: CredentialResolutionRequest) -> CredentialRef:
    # Finds workspace or user credentials without returning raw secret values to the agent.

def classify_tool_risk(manifest: ToolManifest, input: dict) -> ToolRisk:
    # Classifies tool call as read, write, destructive, privileged, or production-impacting.

def redact_tool_output(output: ToolOutput, policy: RedactionPolicy) -> ToolOutput:
    # Removes secrets, tokens, personal data, and forbidden fields before returning to agents.
```

## Configuration / Environment Variables

- `MCP_SERVER_PORT`
- `MCP_TOOL_REGISTRY_DB_URL`
- `MCP_MAX_TOOL_TIMEOUT_MS`
- `MCP_DEFAULT_RATE_LIMIT_PER_MINUTE`
- `TOOL_SECRET_PROVIDER`
- `GITHUB_APP_ID`
- `SLACK_CLIENT_ID`
- `JIRA_CLIENT_ID`

## Data Models / Schemas / Contracts

- `ToolManifest`: name, description, connector, inputSchema, outputSchema, permissions, riskLevel.
- `ToolInvocationRequest`: actor, workspaceId, toolName, input, taskId, traceId.
- `ToolInvocationResult`: status, output, redactions, auditId, durationMs.
- `CredentialRef`: provider, ownerType, ownerId, scopes, secretRef.
- `ToolRisk`: level, reasons, requiresApproval, requiredRole.

## Testing Plan

- Schema validation tests for tool manifests.
- Policy tests for permission, scope, risk, and approval checks.
- Connector tests with mocked external APIs.
- Redaction tests for secrets and personal data.
- End-to-end agent tool invocation test through the gateway.

## Acceptance Criteria

- Agents can discover and call approved tools.
- Tool calls are permissioned, scoped, audited, and redacted.
- Destructive tools require approval.
- Connector failures are returned as structured, retry-aware results.

## Risks And Mitigations

- Risk: external credentials leak. Mitigation: secret references only, redaction, and audit logs.
- Risk: agents misuse write tools. Mitigation: risk classification and human approval.
- Risk: connector APIs drift. Mitigation: contract tests and versioned adapters.

## Next Phase Handoff

Phase 18 should use MCP tools as part of the intelligent chatbot pipeline for retrieval, reasoning, verification, and answers.
