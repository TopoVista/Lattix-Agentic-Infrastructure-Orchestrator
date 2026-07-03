# Phase 15 - Memory System

## Goal

Build Lattix memory across working memory, semantic memory, long-term graph memory, procedural memory, and organizational memory.

## Why This Phase Exists

Agents and chat systems need memory to remain useful across tasks, sessions, repositories, incidents, and organizational decisions. Memory must be scoped, permissioned, auditable, and forgettable so the platform can learn without becoming unsafe or noisy.

## Success Criteria

- Working memory uses Redis for active sessions and agent tasks.
- Semantic memory uses Qdrant for embeddings and retrieval.
- Long-term memory uses Neo4j and durable records.
- Procedural memory captures reusable workflows and learned playbooks.
- Organizational memory captures docs, meeting notes, PRs, incidents, and ADRs.
- Memory writes include scope, provenance, retention, and access policy.

## Deliverables

- Memory service.
- Memory write and retrieval APIs.
- Embedding pipeline.
- Procedural workflow store.
- Retention and deletion policy.
- Memory evaluation and relevance tests.

## Folder Structure

```text
memory/
  service/
  working/
  semantic/
  long-term/
  procedural/
  organizational/
  embeddings/
  policies/
agents/
  memory-agent/
shared/
  memory-contracts/
```

## Modules To Build

- Working memory module.
- Semantic memory module.
- Long-term memory module.
- Procedural memory module.
- Organizational memory module.
- Memory policy module.
- Embedding module.
- Memory retrieval and ranking module.

## Functionality

- Store short-lived task state for chats and agents.
- Embed and retrieve relevant documents, code snippets, decisions, incidents, and conversations.
- Persist durable facts and relationships to the knowledge graph.
- Learn successful workflows as reusable procedures.
- Scope memories to user, workspace, repository, project, team, or global system.
- Apply retention, redaction, deletion, and access policy.
- Return memory evidence with source and confidence.

## Tech Stack

- Redis.
- Qdrant.
- Neo4j.
- PostgreSQL for memory metadata and policies.
- FastAPI or Spring Boot memory service.
- Embedding model abstraction.
- Kafka for memory write events.

## Implementation Plan

1. Define memory types, scopes, retention classes, and access policy.
2. Implement working memory store in Redis with TTL and session binding.
3. Implement semantic memory embedding pipeline and Qdrant collections.
4. Implement long-term memory writes to Neo4j and metadata store.
5. Implement procedural memory for workflow steps, triggers, inputs, outputs, and success criteria.
6. Implement organizational memory ingestion from docs, PRs, incidents, meetings, and ADRs.
7. Implement retrieval planner that chooses memory stores based on request intent.
8. Implement ranking with recency, relevance, authority, permissions, and confidence.
9. Add deletion and retention enforcement.

## Functions / Classes / Interfaces To Implement

```python
def write_memory(request: MemoryWriteRequest) -> MemoryRecord:
    # Stores memory with scope, provenance, retention, permissions, and optional embedding.

def retrieve_memory(request: MemoryRetrievalRequest) -> MemoryRetrievalResult:
    # Searches working, semantic, graph, procedural, and organizational memory as allowed.

def embed_memory(record: MemoryRecord) -> EmbeddingRecord:
    # Creates vector representation and stores it in the correct Qdrant collection.

def learn_procedure(request: ProcedureLearningRequest) -> Procedure:
    # Converts repeated successful workflows into a reusable procedural memory.

def enforce_memory_policy(request: MemoryPolicyRequest) -> PolicyDecision:
    # Applies access, retention, redaction, deletion, and tenant isolation rules.
```

## Configuration / Environment Variables

- `REDIS_URL`
- `QDRANT_URL`
- `NEO4J_URI`
- `MEMORY_EMBEDDING_MODEL`
- `MEMORY_DEFAULT_TTL_SECONDS`
- `MEMORY_RETENTION_POLICY`
- `MEMORY_MAX_RETRIEVAL_RESULTS`

## Data Models / Schemas / Contracts

- `MemoryRecord`: id, type, scope, contentRef, summary, provenance, retention, permissions, createdAt.
- `EmbeddingRecord`: memoryId, collection, vectorId, model, dimensions, createdAt.
- `Procedure`: id, name, trigger, steps, inputs, outputs, successCriteria, confidence.
- `MemoryRetrievalResult`: records, evidence, scores, freshness, deniedCount.
- `MemoryPolicy`: scope, retentionDays, allowedRoles, redactionRules, deletionMode.

## Testing Plan

- Unit tests for memory policy decisions.
- Integration tests with Redis, Qdrant, Neo4j, and Postgres.
- Retrieval relevance tests using seeded fixtures.
- Tenant isolation tests for memory retrieval.
- Retention and deletion tests.

## Acceptance Criteria

- Agents and chat can retrieve relevant memory with evidence.
- Memory is scoped and permissioned.
- Retention and deletion are enforceable.
- Procedural memory can store and retrieve reusable workflows.

## Risks And Mitigations

- Risk: memory leaks private data. Mitigation: enforce scope, permission, and redaction before storage and retrieval.
- Risk: irrelevant memory pollutes answers. Mitigation: ranking, freshness, and evidence thresholds.
- Risk: learned procedures encode bad habits. Mitigation: require evaluation and approval before promotion.

## Next Phase Handoff

Phase 16 should use memory and knowledge graph services to orchestrate multi-agent planning, execution, reflection, and recovery.
