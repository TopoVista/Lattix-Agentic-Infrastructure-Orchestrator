# Lattix System Context

## Purpose

This document defines the product, system, user, and external dependency context for Lattix before implementation begins. It is the baseline for service boundaries, APIs, events, data stores, security controls, diagrams, and later implementation phases.

## System Summary

Lattix is an AI-native engineering control plane. It gives engineering teams a workspace where they can connect repositories, index code, browse files, ask evidence-backed questions, run agent workflows, inspect cloud and deployment state, understand incidents, and simulate changes through a digital twin.

## Primary Actors

| Actor | Responsibilities |
| --- | --- |
| Platform engineer | Manages workspaces, platform services, Kubernetes, Terraform, CI/CD, and cloud automation |
| Software engineer | Browses repositories, edits code, asks questions, accepts AI proposals, and reviews changes |
| SRE or DevOps engineer | Operates deployments, observability, incident response, runbooks, and recovery |
| Security engineer | Manages policies, access, approvals, audit evidence, threat response, and compliance |
| Engineering leader | Reviews delivery risk, architecture impact, cost, reliability, and production readiness |
| Agent | Executes scoped planning, analysis, tool use, review, recovery, and recommendation workflows |
| External system | Provides source code, issues, docs, chat, cloud, observability, CI/CD, or design data |

## External Systems

| System | Direction | Purpose |
| --- | --- | --- |
| GitHub/GitLab | Read/write with approval | Repositories, commits, pull requests, issues, review context |
| Jira | Read/write with approval | Tasks, epics, requirements, incident follow-ups |
| Slack/Discord | Read/write with approval | Notifications, incident channels, meeting or conversation context |
| Gmail/Outlook/Calendar | Read with approval | Organizational memory, decisions, meetings, scheduling context |
| Google Drive/OneDrive/Dropbox | Read/write with approval | Documents, diagrams, artifacts, imported knowledge |
| Figma | Read with approval | Design assets, UI inspection, screenshot-to-code context |
| Docker/Kubernetes | Read/write with approval | Runtime state, workload operations, deployments, repair actions |
| Terraform | Plan by default, apply with approval | Infrastructure desired state and cloud operations |
| Jenkins/ArgoCD/GitHub Actions | Read/write with approval | Build, deploy, rollback, release state |
| SonarQube/Sentry | Read | Code quality, runtime errors, issue intelligence |
| AWS/GCP/Azure | Read/write with approval | Cloud resource inventory, provisioning, scaling, repair, cost |
| Observability stack | Read/write config with approval | Metrics, logs, traces, alerts, SLOs, dashboards |

## Internal Subsystems

| Subsystem | Purpose |
| --- | --- |
| Frontend workspace | Browser-based UI for dashboards, repositories, editor, chat, agents, tasks, and operations |
| API gateway | Edge routing, auth enforcement, rate limiting, validation, tracing, and API versioning |
| Core backend services | Auth, user, workspace, repository, project, notification, tool, search, knowledge, memory, document, analytics, logging, monitoring |
| Event platform | Kafka events, outbox, retries, DLQs, sagas, CQRS, CDC, replay |
| Data layer | Postgres, Redis, MongoDB, Neo4j, Qdrant, ClickHouse, MinIO/S3, OpenSearch |
| Repository intelligence | Code ingestion, parsing, symbols, AST, graphs, search, references, impact analysis |
| Knowledge graph | Connected facts about code, people, infrastructure, incidents, decisions, docs, metrics, and deployments |
| Memory system | Working, semantic, long-term, procedural, and organizational memory |
| Agent platform | Supervisor, planner, decomposer, scheduler, executor, evaluator, reviewer, critic, recovery, approval, and role agents |
| MCP tool ecosystem | Governed external tool registry and invocation gateway |
| Chat pipeline | Intent, retrieval, reasoning, verification, fact checking, confidence, and answer generation |
| Data and ML platform | Lakehouse, feature store, ML training, model registry, model serving, predictions |
| Cloud controllers | Policy-aware provision, deploy, scale, rollback, delete, monitor, and repair workflows |
| CI/CD platform | Analysis, tests, AI review, scans, build, deploy, smoke, canary, blue-green, rollback |
| Observability | Metrics, logs, traces, alerts, dashboards, SLOs, telemetry exports |
| Digital twin | Living model and simulation engine for what-if analysis |

## Trust Boundaries

| Boundary | Notes |
| --- | --- |
| Browser to gateway | Public internet boundary; requires TLS, auth tokens, CSRF-aware flows, request limits, and trace IDs |
| Gateway to services | Internal network boundary; requires service identity, mTLS where mesh is enabled, and propagated principal context |
| Services to data stores | Private network boundary; requires least privilege credentials, encryption, tenant filters, and query audit for sensitive actions |
| Agents to tools | High-risk boundary; requires tool policy, scope, approval, redaction, and audit |
| Lattix to cloud providers | High-risk boundary; write actions require plan, approval, audit, rollback, and blast radius |
| Lattix to external SaaS | Requires OAuth scopes, credential references, rate limits, data minimization, and revocation |
| AI model provider | Sensitive context boundary; prompts must be filtered, scoped, and logged without secrets |

## Core Workflows

### Repository Onboarding

1. User authenticates and selects workspace.
2. User registers repository provider, URL, branch, and credential reference.
3. Repository service validates access.
4. Repository snapshot is stored.
5. Indexing event is published.
6. Repository intelligence parses code and builds indexes.
7. Knowledge graph imports repository facts.
8. Workspace dashboard shows repository status.

### Evidence-Backed Chat

1. User asks a question in workspace context.
2. Chat pipeline classifies intent and risk.
3. Retrieval planner selects knowledge graph, repository search, semantic memory, logs, metrics, and tools.
4. Context aggregator filters by permissions and ranks evidence.
5. LLM generates a draft answer.
6. Verifier checks claims against evidence.
7. Confidence scorer returns answer with citations, assumptions, and limitations.

### Agent Task Execution

1. User creates an agent task.
2. Supervisor creates durable task record.
3. Planner decomposes the task into a graph.
4. Scheduler selects executable steps.
5. Execution engine calls agents and tools through policy gateway.
6. Risky actions pause for human approval.
7. Reviewer, critic, and evaluator inspect outputs.
8. Result, evidence, traces, and audit records are stored.

### Cloud Automation

1. User or agent requests cloud action.
2. Cloud controller validates identity, policy, environment, and resource.
3. Controller creates dry-run plan with blast radius, cost, and rollback path.
4. Approval workflow gates risky actions.
5. Controller executes approved plan.
6. Observed state and audit events update knowledge graph and digital twin.

## Tenant And Workspace Model

- Tenant represents a customer or organization boundary.
- Workspace represents a team, product, or platform boundary inside a tenant.
- Repository, project, task, agent run, document, memory, and audit records must be scoped to workspace unless explicitly system-level.
- Cross-workspace access requires explicit policy.
- Derived indexes must preserve tenant and workspace filters.

## Deployment Context

Lattix starts with local Docker Compose and local Kubernetes for development. It progresses to AWS-first cloud infrastructure with Terraform and EKS, while keeping provider abstraction boundaries for GCP and Azure.

Production deployments should use:

- API gateway at the edge.
- Private backend services in Kubernetes.
- Managed or hardened datastores.
- Central observability.
- Central audit stream.
- CI/CD and GitOps-ready deployment controls.

## Quality Attributes

- Secure by default.
- Observable by default.
- Auditable by default.
- Tenant-scoped by default.
- Evidence-backed AI by default.
- Approval-gated risky actions by default.
- Derived stores rebuildable by default.

## Open Questions

- Which Git provider is implemented first after local repository support?
- Which LLM provider is used for MVP?
- Which programming languages are first-class in repository intelligence v1?
- Which cloud provider accounts and regions are used for initial staging?
- Which enterprise compliance framework is prioritized first beyond SOC2/GDPR-ready architecture?
