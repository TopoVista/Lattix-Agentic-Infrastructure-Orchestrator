# Lattix Database Design

## Purpose

This document defines initial data ownership, storage engines, source-of-truth boundaries, derived indexes, and schema conventions for Lattix.

## Storage Strategy

| Store | Role | Source Of Truth | Notes |
| --- | --- | --- | --- |
| PostgreSQL | Transactional product data | Yes | Users, workspaces, sessions, tasks, approvals, audit metadata, repository records |
| Redis | Cache, locks, rate limits, active task state, working memory | No for most data | TTL-based; must not be only copy of critical data |
| MongoDB | Flexible documents and imported content | Sometimes | Used for raw or semi-structured docs when relational schema is not ideal |
| Neo4j | Knowledge graph and digital twin relationships | Derived plus curated facts | Graph facts include provenance and freshness |
| Qdrant | Vector embeddings and semantic memory | Derived | Rebuildable from source documents and memory metadata |
| ClickHouse | Analytics, metrics, event aggregates, benchmark and cost history | Derived | Optimized for large analytical reads |
| MinIO/S3 | Object artifacts | Yes for artifacts | Repository snapshots, docs, images, model artifacts, exports, backups |
| OpenSearch | Full-text and symbol search | Derived | Rebuildable from repositories, docs, and source records |

## Ownership Rules

- Each service owns its transactional tables.
- Cross-service reads should use APIs, events, read models, or documented shared views.
- Derived stores must include source references and rebuild workflows.
- Every tenant-scoped record must include `tenant_id` or inherit it through workspace relation.
- Every workspace-scoped record must include `workspace_id`.
- Sensitive records must include data class, retention, and audit metadata where applicable.

## Initial PostgreSQL Domains

### Identity And Auth

- `users`
- `external_identities`
- `sessions`
- `refresh_tokens`
- `mfa_methods`
- `roles`
- `role_assignments`
- `policy_decisions`

### Workspace And Projects

- `tenants`
- `workspaces`
- `workspace_members`
- `projects`
- `tasks`
- `notifications`

### Repositories

- `repositories`
- `repository_credentials`
- `repository_snapshots`
- `repository_index_jobs`
- `repository_index_errors`

### Agents And Approvals

- `agent_tasks`
- `agent_task_steps`
- `agent_tool_calls`
- `agent_evaluations`
- `approval_requests`
- `approval_decisions`

### Chat And Memory Metadata

- `conversations`
- `conversation_messages`
- `memory_records`
- `procedure_records`

### Audit And Compliance

- `audit_events`
- `audit_exports`
- `retention_policies`
- `data_subject_requests`

## Core Entity Sketches

### User

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `email` | text | Unique normalized email |
| `display_name` | text | User display name |
| `status` | text | active, disabled, invited |
| `created_at` | timestamptz | Creation timestamp |
| `last_login_at` | timestamptz | Nullable |

### Workspace

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `tenant_id` | UUID | Tenant boundary |
| `name` | text | Human name |
| `slug` | text | Unique per tenant |
| `owner_user_id` | UUID | Initial owner |
| `status` | text | active, archived, suspended |
| `created_at` | timestamptz | Creation timestamp |

### Repository

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `workspace_id` | UUID | Workspace scope |
| `provider` | text | github, gitlab, local, other |
| `url` | text | Repository URL |
| `default_branch` | text | Default branch |
| `credential_ref` | text | Secret reference, not raw token |
| `status` | text | active, inaccessible, archived |
| `last_indexed_at` | timestamptz | Nullable |

### Agent Task

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `workspace_id` | UUID | Workspace scope |
| `created_by_user_id` | UUID | Actor |
| `goal` | text | User or system goal |
| `status` | text | queued, running, paused, completed, failed, cancelled |
| `risk_level` | text | low, medium, high, critical |
| `trace_id` | text | Trace correlation |
| `created_at` | timestamptz | Creation timestamp |

### Audit Event

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `tenant_id` | UUID | Tenant scope |
| `workspace_id` | UUID | Nullable for tenant/system events |
| `actor_type` | text | user, service, agent, system |
| `actor_id` | text | Actor identifier |
| `action` | text | Verb |
| `resource_type` | text | Resource kind |
| `resource_id` | text | Resource identifier |
| `decision` | text | allowed, denied, approved, rejected |
| `trace_id` | text | Trace correlation |
| `created_at` | timestamptz | Event timestamp |

## Neo4j Graph Model

### Node Labels

- `Tenant`
- `Workspace`
- `User`
- `Team`
- `Repository`
- `Package`
- `File`
- `Class`
- `Function`
- `API`
- `Database`
- `Table`
- `EventTopic`
- `Service`
- `Deployment`
- `CloudResource`
- `Incident`
- `Alert`
- `Metric`
- `LogPattern`
- `Document`
- `ADR`
- `Meeting`
- `Decision`
- `AgentTask`

### Relationship Types

- `OWNS`
- `MEMBER_OF`
- `CONTAINS`
- `CALLS`
- `DEPENDS_ON`
- `IMPLEMENTS`
- `EXPOSES`
- `CONSUMES`
- `PRODUCES`
- `DEPLOYS_TO`
- `CHANGED_BY`
- `CAUSED`
- `MITIGATED_BY`
- `DOCUMENTED_BY`
- `DISCUSSED_IN`
- `APPROVED_BY`
- `VIOLATES`
- `RELATED_TO`

## Qdrant Collections

| Collection | Purpose |
| --- | --- |
| `workspace_documents` | Docs, ADRs, imported pages, summaries |
| `repository_code` | Code chunks and symbol summaries |
| `conversation_memory` | Permissioned conversation facts |
| `incident_memory` | Incident summaries, actions, lessons |
| `procedure_memory` | Reusable workflows and playbooks |

## OpenSearch Indexes

| Index | Purpose |
| --- | --- |
| `repositories-files-v1` | File names, paths, languages, content snippets |
| `repositories-symbols-v1` | Symbols, signatures, definitions, references |
| `documents-v1` | Docs and imported content |
| `audit-events-v1` | Audit search |
| `tool-invocations-v1` | Tool call search |

## ClickHouse Tables

| Table | Purpose |
| --- | --- |
| `platform_events` | Normalized event stream |
| `request_metrics` | API and service request aggregates |
| `agent_step_metrics` | Agent latency, tokens, tools, outcomes |
| `pipeline_metrics` | CI/CD stage timing and outcomes |
| `cost_records` | Cloud and platform cost analytics |
| `benchmark_results` | Performance benchmark history |

## Object Storage Buckets

| Bucket | Purpose |
| --- | --- |
| `lattix-repository-snapshots` | Repository archives and commit snapshots |
| `lattix-documents` | Uploaded and imported documents |
| `lattix-artifacts` | CI/CD artifacts, reports, generated plans |
| `lattix-model-artifacts` | ML model files and evaluation artifacts |
| `lattix-audit-exports` | Compliance and audit export packages |
| `lattix-backups` | Backup artifacts |

## Migration Rules

- Use Flyway or Liquibase for Postgres schema changes.
- Every migration must be reversible or include a documented fallback.
- Large table changes must use expand, backfill, dual-write, cutover, and cleanup.
- Derived stores use rebuild jobs rather than manual mutation.
- Schema changes must include test fixtures and contract impact notes.

## Backup And Recovery Rules

- PostgreSQL and object storage are critical source-of-truth stores.
- Neo4j is critical for curated knowledge but must preserve provenance.
- Qdrant, OpenSearch, and ClickHouse are rebuildable where source data exists.
- Backup policy must define RTO, RPO, retention, encryption, and restore validation.

## Acceptance Criteria

- Every datastore has a clear reason to exist.
- Source-of-truth and derived data boundaries are explicit.
- Tenant and workspace scoping rules are defined.
- Initial tables and indexes are sufficient to start backend, gateway, repository, agent, and audit phases.
