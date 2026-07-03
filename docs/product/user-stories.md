# Lattix User Stories

## Workspace And Onboarding

### Story WS-001: Create Workspace

As a platform engineer, I want to create a workspace so that my team's repositories, services, cloud accounts, docs, and agents are grouped under one controlled boundary.

Acceptance criteria:

- User can create a workspace with name, slug, owner, and default settings.
- Workspace is linked to the authenticated user.
- Workspace creation emits an audit event and a domain event.
- Workspace appears in the workspace switcher.

### Story WS-002: Register Repository

As a backend engineer, I want to register a repository so that Lattix can browse, index, search, and reason over its code.

Acceptance criteria:

- User can add a repository provider, URL, default branch, and access credential reference.
- Lattix validates access without exposing secret values.
- Repository metadata is stored under the workspace.
- Repository indexing job is scheduled.
- User can see indexing status and errors.

### Story WS-003: Browse Repository

As a developer, I want to browse repository files so that I can inspect code without leaving the workspace.

Acceptance criteria:

- User can select repository, branch, and path.
- File tree renders folders and files.
- File content renders with language hint and metadata.
- Permission denied, empty, large file, and binary file states are handled.

## Repository Intelligence

### Story RI-001: Search Symbols

As a backend engineer, I want to search symbols so that I can find classes, functions, DTOs, APIs, and modules quickly.

Acceptance criteria:

- User can search by symbol name, type, language, and path.
- Results include file path, range, signature, and confidence.
- Results respect workspace permissions.
- Search latency is visible in telemetry.

### Story RI-002: Analyze Change Impact

As a platform engineer, I want to ask what depends on a service, API, or database table so that I can estimate blast radius before a change.

Acceptance criteria:

- Lattix returns dependent services, APIs, files, owners, tests, docs, and deployments.
- Result includes graph evidence and freshness.
- Result includes confidence and unknowns.
- User can export or attach the result to a task.

## Intelligent Editor

### Story ED-001: Open Code In Editor

As a developer, I want to open a repository file in the editor so that I can inspect code structure, diagnostics, and references.

Acceptance criteria:

- Monaco editor loads file content.
- Language detection chooses editor mode.
- AST, symbols, diagnostics, and references can be opened from panels.
- Large files show a safe fallback state.

### Story ED-002: Preview AI Code Proposal

As a developer, I want AI suggestions to appear as reviewable diffs so that I can accept only safe changes.

Acceptance criteria:

- Suggestion includes changed files, diff hunks, explanation, evidence, tests, and confidence.
- User can accept, reject, or ask for explanation.
- Policy violations block or warn before acceptance.
- Accepted changes are audit logged.

## Chat And Agents

### Story AI-001: Ask Evidence-Backed Question

As an engineer, I want to ask Lattix why something failed so that I can get an answer grounded in code, logs, metrics, deployments, and incidents.

Acceptance criteria:

- Chat pipeline classifies intent.
- Relevant evidence is retrieved from allowed sources.
- Answer cites evidence and marks uncertainty.
- Unsupported claims are removed or flagged.
- Conversation memory follows workspace policy.

### Story AI-002: Create Agent Task

As a platform engineer, I want to ask an agent to plan a Kubernetes rollout so that I can review a safe strategy before execution.

Acceptance criteria:

- Agent creates a task graph with steps, tools, risks, and approvals.
- High-risk actions require human approval.
- Agent output includes evidence, rollback plan, and tests.
- Task execution is traceable and auditable.

### Story AI-003: Human Approval For Risky Action

As a security engineer, I want destructive or privileged agent actions to pause for approval so that automation cannot bypass governance.

Acceptance criteria:

- Approval request includes actor, action, resource, risk, evidence, and expiry.
- Only authorized roles can approve.
- Rejected actions do not execute.
- Decision is stored in audit log.

## Tool Integrations

### Story TI-001: Connect GitHub

As a developer, I want to connect GitHub so that Lattix can read repositories, pull requests, issues, and commit metadata.

Acceptance criteria:

- OAuth or app installation flow stores credential reference.
- Granted scopes are visible.
- Tool calls are audited.
- Revoking access prevents future tool use.

### Story TI-002: Query Kubernetes

As an SRE, I want Lattix to inspect Kubernetes workloads so that incident and deployment agents can use live runtime context.

Acceptance criteria:

- Kubernetes tool lists allowed namespaces and workloads.
- Access is scoped to workspace and role.
- Read-only tools do not require destructive permissions.
- Tool output redacts sensitive values.

## Cloud And CI/CD

### Story CD-001: Run Safe Deployment Pipeline

As a DevOps engineer, I want deployments to pass through analysis, tests, scans, AI review, smoke tests, and canary gates so that production changes are safer.

Acceptance criteria:

- Pipeline stages record status, logs, metrics, artifacts, and findings.
- Failed required stages block promotion.
- Deployment strategy is selected by risk.
- Smoke or metric failure can pause or roll back deployment.

### Story CL-001: Plan Cloud Change

As a platform engineer, I want cloud changes to be planned before execution so that cost, security, and blast radius are visible.

Acceptance criteria:

- Cloud controller validates actor, environment, provider, and resource.
- Plan includes proposed changes, risk, cost estimate, and rollback path.
- Destructive or production actions require approval.
- Execution result is audited.

## Observability And Incident Response

### Story IR-001: Investigate Incident

As an SRE, I want Lattix to connect alerts, logs, traces, deployments, code changes, and owners so that I can understand incidents faster.

Acceptance criteria:

- Incident view shows timeline, affected services, alerts, logs, metrics, traces, deployments, and owners.
- Agent can summarize probable causes with evidence.
- Action items and follow-ups are generated.
- Incident facts are stored in knowledge graph.

### Story OB-001: Trace Agent Action

As an operator, I want every agent action to be traceable so that I can understand what it did and why.

Acceptance criteria:

- Trace includes task, step, tool calls, evidence, policy decisions, approvals, and outputs.
- Logs redact secrets.
- Audit record links to trace ID.

## Digital Twin

### Story DT-001: Simulate DTO Rename

As a backend engineer, I want to ask what breaks if I rename a DTO so that I can plan the change safely.

Acceptance criteria:

- Digital twin identifies affected APIs, clients, tests, events, docs, and deployments.
- Result includes graph paths and evidence.
- Unknown or stale data is disclosed.
- Recommended validation steps are provided.

### Story DT-002: Estimate Cloud Migration Cost

As a CTO, I want to estimate cost impact of moving workloads from EC2 to EKS so that I can make an informed architecture decision.

Acceptance criteria:

- Current resource inventory and usage are included.
- Target architecture assumptions are explicit.
- Estimate includes confidence, expected savings or increase, and risks.
- Recommendation links to supporting cost data.

## Security And Compliance

### Story SC-001: Export Audit Evidence

As a security engineer, I want to export audit evidence for a time window so that compliance reviews are faster.

Acceptance criteria:

- Export includes audit events, approvals, security findings, CI evidence, DR evidence, and access reviews.
- Export is tamper-evident with checksum metadata.
- Access to export requires authorization.

### Story SC-002: Enforce Retention Policy

As a privacy owner, I want data retention policies to be enforced so that the platform respects legal and tenant requirements.

Acceptance criteria:

- Data classes have retention rules.
- Deletion, archive, and legal hold states are supported.
- Retention jobs produce audit records.
- User-facing deletion requests are tracked to completion.
