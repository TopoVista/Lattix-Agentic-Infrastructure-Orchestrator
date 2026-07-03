# ADR 0001 - Lattix Platform Architecture

## Status

Accepted for initial implementation.

## Date

2026-07-02

## Context

Lattix must combine developer workspace UI, backend services, repository intelligence, agent orchestration, external tool integrations, cloud automation, observability, data engineering, machine learning, memory, knowledge graph, and digital twin capabilities.

The system will grow through 40 implementation phases. Early choices must allow incremental delivery without forcing rewrites when advanced phases arrive.

Key requirements:

- Every phase should be deployable or operationally useful.
- AI outputs must be grounded in evidence and policy.
- Destructive or production-impacting actions must require approval.
- Data must be tenant and workspace scoped.
- Services must be observable and auditable.
- External systems must connect through governed adapters.
- Derived data stores must be rebuildable.

## Decision

Lattix will use an enterprise monorepo with a service-oriented architecture:

- Next.js, React, TypeScript, Tailwind, and Monaco for the frontend workspace.
- Spring Boot and Java 21 for core backend services and gateway.
- FastAPI and Python for AI, agents, repository intelligence, ML, vision, signal, and orchestration services.
- Kafka for asynchronous events and workflow integration.
- PostgreSQL for transactional source-of-truth data.
- Redis for cache, rate limiting, locks, working memory, and active task state.
- Neo4j for knowledge graph and long-term relationship facts.
- Qdrant for vector search and semantic memory.
- ClickHouse for analytics, observability-derived facts, and cost/performance datasets.
- OpenSearch for full-text and symbol search.
- MinIO locally and S3 in cloud for object artifacts.
- Terraform for cloud infrastructure.
- Kubernetes and Helm for workload orchestration.
- OpenTelemetry, Prometheus, Grafana, Jaeger, Loki, and Tempo for observability.

Lattix will use these architecture rules:

- Gateway is the only public API entry point for application traffic.
- Services own their transactional state.
- Events connect services, indexes, agents, analytics, memory, and graph updates.
- External tools are invoked through the MCP tool gateway, not directly by agents.
- Cloud write actions are plan-first and approval-gated.
- AI answers include evidence, assumptions, limitations, confidence, and policy status.
- Audit and trace context are propagated through HTTP, events, agents, and tools.

## Alternatives Considered

### Single Monolith

Rejected. A monolith would simplify early development but would make AI services, data pipelines, agent runtime, cloud controllers, and polyglot analysis components harder to scale and evolve independently.

### Many Separate Repositories

Rejected for early phases. Many repositories would increase coordination cost before interfaces stabilize. The monorepo keeps contracts, docs, shared libraries, infrastructure, and tests discoverable.

### One Database For Everything

Rejected. Lattix needs transactional records, document storage, graph traversal, vector retrieval, analytics, object artifacts, and full-text search. These workloads require different engines.

### Direct Agent Access To Tools

Rejected. Agents must not directly hold credentials or bypass policies. Tool calls require scope, redaction, rate limits, audit, and approval controls.

### Cloud Console And Manual Operations

Rejected as a primary control model. Manual operations are not reproducible or auditable enough. Terraform, Kubernetes, cloud controllers, and runbooks are required.

## Consequences

Positive:

- Architecture supports incremental delivery and later scale.
- AI, data, cloud, and enterprise features have clear subsystem boundaries.
- Audit, security, approval, and observability are built into the platform.
- Derived stores can be rebuilt and improved without losing source-of-truth data.

Negative:

- The platform has operational complexity from multiple services and datastores.
- Developers need local profiles to avoid running every dependency at once.
- Contract discipline is required to prevent service and event sprawl.
- Cross-system tracing and policy enforcement must be implemented consistently.

## Follow-Up Decisions

- ADR for first-class repository languages.
- ADR for LLM provider abstraction and model routing.
- ADR for tenant isolation model.
- ADR for cloud provider rollout sequence.
- ADR for event schema format.
- ADR for memory retention and privacy policy.
