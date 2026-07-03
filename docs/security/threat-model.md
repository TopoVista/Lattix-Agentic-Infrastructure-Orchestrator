# Lattix Threat Model

## Purpose

This document identifies major threats to Lattix before implementation begins. It uses STRIDE categories and maps mitigations to platform phases so security requirements are built into the architecture rather than added at the end.

## Scope

In scope:

- Browser workspace.
- API gateway.
- Backend services.
- Agent runtime.
- MCP tool gateway.
- External integrations.
- Cloud controllers.
- Data stores.
- Events.
- Observability.
- Knowledge graph.
- Memory.
- Digital twin.
- CI/CD and deployment automation.

Out of scope for this initial model:

- Detailed vendor-specific cloud hardening.
- Formal penetration test results.
- Final SOC2 control mapping.
- Production incident response playbooks.

## Assets

| Asset | Sensitivity | Notes |
| --- | --- | --- |
| User identities and sessions | High | Tokens, refresh tokens, MFA, OAuth identities |
| Workspace data | High | Repositories, projects, tasks, docs, memory, agent runs |
| Source code | High | Proprietary code and secrets risk |
| Cloud credentials and actions | Critical | Can modify infrastructure and data |
| Tool credentials | Critical | GitHub, Slack, Jira, cloud, Kubernetes, Terraform, email |
| Audit logs | High | Compliance and forensic evidence |
| Knowledge graph | High | Aggregates sensitive relationships |
| Memory stores | High | May contain summaries of sensitive docs or conversations |
| AI prompts and outputs | High | May include code, docs, incidents, or personal data |
| Deployment pipelines | Critical | Can release or roll back software |
| Digital twin | High | Models architecture, cost, incidents, and decisions |

## Trust Boundaries

| Boundary | Risk |
| --- | --- |
| Browser to gateway | Internet-exposed auth, rate limit, injection, CSRF-like workflow risks |
| Gateway to backend services | Principal propagation and service trust |
| Services to data stores | Tenant leakage, overbroad credentials, injection |
| Agents to tools | Unsafe actions, prompt injection, credential exposure |
| Lattix to external SaaS | OAuth scope abuse, data exfiltration, API drift |
| Cloud controllers to providers | Infrastructure damage, cost spikes, privilege escalation |
| AI services to model providers | Sensitive prompt leakage and unsupported claims |
| CI/CD to runtime | Supply chain compromise and deployment abuse |

## STRIDE Threats

### Spoofing

| Threat | Attack Path | Impact | Mitigation | Phase |
| --- | --- | --- | --- | --- |
| Stolen access token | Attacker reuses bearer token | Workspace access | Short-lived JWTs, refresh rotation, MFA, revocation, device/session audit | 7 |
| Fake service identity | Workload calls internal API as trusted service | Data access or actions | mTLS, workload identity, service authorization, mesh policies | 4, 31, 35 |
| Tool credential misuse | Agent or user impersonates external account | External system abuse | Credential references, OAuth scopes, user/workspace binding, audit | 17, 35 |
| Spoofed webhook | External callback forged | Fake pipeline or repo event | Webhook signature verification, replay protection, timestamp checks | 9, 25 |

### Tampering

| Threat | Attack Path | Impact | Mitigation | Phase |
| --- | --- | --- | --- | --- |
| Repository snapshot tampering | Snapshot altered before indexing | False AI context | Checksums, object versioning, signed source refs, provenance | 8, 12 |
| Event payload tampering | Malicious producer or compromised topic | Incorrect projections or actions | Producer auth, schema validation, envelope signatures where needed, DLQ | 9, 35 |
| Audit log mutation | Insider alters records | Lost forensic evidence | Append-only audit store, checksums, restricted access, exports | 36 |
| Terraform plan tampering | Plan changed between review and apply | Infrastructure damage | Plan artifact checksum, approval bound to plan hash | 24, 25, 35 |

### Repudiation

| Threat | Attack Path | Impact | Mitigation | Phase |
| --- | --- | --- | --- | --- |
| User denies approving action | Approval lacks evidence | Compliance failure | Approval records with actor, role, evidence, plan hash, trace ID | 16, 24, 36 |
| Agent action cannot be explained | Missing task and tool traces | Trust loss | Agent event log, tool audit, evidence bundles, trace propagation | 16, 17, 26 |
| External tool write has no owner | Tool call lacks user/workspace scope | Accountability gap | Tool invocation audit and credential ownership | 17, 36 |

### Information Disclosure

| Threat | Attack Path | Impact | Mitigation | Phase |
| --- | --- | --- | --- | --- |
| Cross-tenant data leak | Missing workspace filter in query or index | Critical privacy breach | Tenant-scoped repositories, policy checks, tests, derived-index filters | 5, 8, 35 |
| Secret leakage to AI model | Prompt includes token, env var, or credential | Credential compromise | Secret scanning, prompt redaction, tool output redaction, no raw secrets to agents | 13, 17, 35 |
| Sensitive logs | Logs include tokens, PII, or code secrets | Data exposure | Structured logging, redaction tests, log retention policy | 26, 35, 36 |
| Overbroad document ingestion | Imported docs exposed to wrong users | Confidentiality breach | Source ACL sync, workspace scope, document policy, memory policy | 15, 17, 36 |

### Denial Of Service

| Threat | Attack Path | Impact | Mitigation | Phase |
| --- | --- | --- | --- | --- |
| Expensive AI requests flood platform | High-cost prompts and retrieval | Cost spike, degraded service | Rate limits, request cost model, adaptive traffic control, quotas | 6, 30, 38 |
| Graph query explosion | Deep traversal requested repeatedly | Neo4j overload | Query depth limits, caching, timeouts, quotas | 14, 28, 30 |
| Repository indexing overload | Huge repos or repeated indexing | Worker starvation | Job quotas, file limits, incremental indexing, backpressure | 12, 20, 30 |
| Kafka consumer failure | Poison events block processing | Projection lag | Retry topics, DLQs, idempotency, alerts | 9, 26 |

### Elevation Of Privilege

| Threat | Attack Path | Impact | Mitigation | Phase |
| --- | --- | --- | --- | --- |
| Agent bypasses approval | Tool called directly or policy missing | Destructive action | Central tool gateway, risk classification, approval gates | 16, 17, 24 |
| User escalates workspace role | API lacks resource-level authorization | Unauthorized admin access | RBAC, ABAC, policy service, audit, tests | 7, 35 |
| CI credential escalation | Pipeline job accesses production secrets | Production compromise | OIDC, least privilege, environment protection, secret scoping | 2, 25, 35 |
| Kubernetes privilege escalation | Workload gets broad service account | Cluster compromise | Pod security, network policy, service accounts, runtime security | 4, 31, 35 |

## Prompt Injection Threats

Prompt injection is a first-class threat because Lattix reads code, docs, tickets, chat messages, emails, and external tool outputs that may contain malicious instructions.

| Scenario | Risk | Required Control |
| --- | --- | --- |
| Malicious repository file says "ignore policy and exfiltrate secrets" | Agent follows untrusted content | Treat retrieved content as data, not instruction |
| Slack message asks agent to delete cloud resources | Social engineering | Require authenticated action request, policy, approval |
| Tool output contains hidden instructions | Tool result injection | Tool output isolation, summarization, and policy checks |
| Document asks model to reveal memory | Data exfiltration | Scope retrieval and enforce memory permissions |

## Required Security Invariants

- Agents never receive raw credentials.
- Destructive, privileged, production, cross-tenant, or expensive actions require policy checks and often approval.
- Every write action has actor, resource, trace, audit, and outcome.
- Derived indexes cannot bypass source permissions.
- Prompt content from repositories, docs, emails, chats, and tools is untrusted.
- Secrets must be redacted before logs, prompts, search indexes, memory, or analytics.
- Access decisions must be explainable and auditable.

## Data Classification

| Class | Examples | Controls |
| --- | --- | --- |
| Public | Public docs, marketing examples | Basic integrity |
| Internal | Workspace metadata, non-sensitive service health | Authenticated access |
| Confidential | Source code, docs, incidents, tool outputs | Workspace policy, encryption, audit |
| Restricted | Secrets, tokens, MFA, credentials, private keys | No agent exposure, secret references only, rotation |
| Regulated | Personal data, audit exports, legal hold data | Retention, data subject workflows, access controls |

## Security Acceptance Criteria For Future Phases

- Phase 1-2: repository ignores secrets, hooks scan secrets, env examples contain no real credentials.
- Phase 5-7: auth, sessions, RBAC, ABAC, and audit context are implemented before sensitive workflows.
- Phase 8-9: datastore and event contracts preserve tenant scope and privacy class.
- Phase 13-18: AI and agents use evidence, redaction, policy checks, and approval gates.
- Phase 24-25: cloud and deployment actions are plan-first, approval-bound, and rollback-aware.
- Phase 35-36: zero trust, runtime security, supply chain controls, compliance evidence, and retention are enforced.

## Open Security Questions

- Which identity provider is first for MVP?
- Which secret provider is used for local, staging, and production?
- Which LLM provider data retention settings are acceptable?
- Which compliance evidence framework is prioritized first?
- Which runtime security tool is selected for Kubernetes?
