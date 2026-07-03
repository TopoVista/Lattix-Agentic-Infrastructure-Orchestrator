# Phase 08 - Database Layer

## Goal

Create the polyglot persistence layer for Lattix using the right storage engine for each data shape.

## Why This Phase Exists

Lattix stores transactional product data, session state, documents, code graphs, vectors, analytics, object files, and search indexes. A single database cannot serve all of these well. This phase defines ownership, lifecycle, access patterns, migrations, backups, and local development defaults for each store.

## Success Criteria

- PostgreSQL, Redis, MongoDB, Neo4j, ClickHouse, Qdrant, MinIO, and OpenSearch are available locally.
- Each datastore has a documented owner, purpose, schema strategy, backup strategy, and access pattern.
- Services use typed repository interfaces rather than direct ad hoc clients.
- Migration, seed, backup, restore, and health check conventions exist.

## Deliverables

- Local datastore profiles in Docker Compose.
- Database ownership matrix.
- Migration directories and naming conventions.
- Shared persistence adapters.
- Health check and backup runbooks.
- Initial schemas for identity, workspace, repository metadata, audit, and documents.

## Folder Structure

```text
shared/
  persistence/
    postgres/
    redis/
    mongo/
    neo4j/
    qdrant/
    clickhouse/
    opensearch/
services/
  */src/main/resources/db/migration/
memory/
  schemas/
knowledge-graph/
  schemas/
docs/
  architecture/database-design.md
```

## Modules To Build

- PostgreSQL module for transactional state.
- Redis module for cache, rate limits, locks, and working memory.
- MongoDB module for flexible documents and imported content.
- Neo4j module for knowledge graph entities and relationships.
- Qdrant module for embeddings and semantic retrieval.
- ClickHouse module for metrics, analytics, and event aggregates.
- MinIO/S3 module for artifacts, repository snapshots, documents, and model assets.
- OpenSearch module for full-text search.

## Functionality

- Provide health checks for every store.
- Provide schema migration and seed workflows.
- Provide connection pooling and timeout defaults.
- Provide repository abstractions with tenant and workspace filters.
- Provide backup and restore scripts for critical stores.
- Provide derived-index rebuild workflows for search, vector, graph, and analytics stores.

## Tech Stack

- PostgreSQL.
- Redis.
- MongoDB.
- Neo4j.
- ClickHouse.
- Qdrant.
- MinIO locally and Amazon S3 in cloud.
- OpenSearch.
- Flyway or Liquibase.
- Testcontainers.

## Implementation Plan

1. Define datastore ownership matrix and access patterns.
2. Add local Compose profiles for each datastore.
3. Create shared clients with timeouts, retries, telemetry, and tenant context.
4. Add migration conventions for Postgres and schema setup for graph, search, vector, and analytics stores.
5. Add initial schemas for auth, workspaces, repositories, projects, audit logs, documents, and system metadata.
6. Add object storage bucket conventions for artifacts, imports, exports, model assets, and backups.
7. Add backup and restore scripts for Postgres, Neo4j, object storage, and critical indexes.
8. Add integration tests with Testcontainers.

## Functions / Classes / Interfaces To Implement

```java
TenantScopedRepository<T, ID>
// Base interface that requires tenant and workspace filtering for persisted entities.

DatabaseHealthReport checkDatastoreHealth(DatastoreName name)
// Verifies connectivity, latency, schema version, and dependency-specific health.

MigrationResult applyMigrations(MigrationRequest request)
// Applies migration files and records version, checksum, execution time, and outcome.

ObjectRef storeObject(StoreObjectRequest request)
// Uploads artifacts or documents to object storage with tenant metadata and checksum.

SearchIndexJob enqueueIndexRebuild(IndexRebuildRequest request)
// Schedules rebuilding of derived search, vector, graph, or analytics indexes.
```

## Configuration / Environment Variables

- `POSTGRES_URL`
- `POSTGRES_USERNAME`
- `POSTGRES_PASSWORD`
- `REDIS_URL`
- `MONGO_URI`
- `NEO4J_URI`
- `NEO4J_USERNAME`
- `NEO4J_PASSWORD`
- `CLICKHOUSE_URL`
- `QDRANT_URL`
- `MINIO_ENDPOINT`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `OPENSEARCH_URL`

## Data Models / Schemas / Contracts

- `Workspace`: id, name, slug, ownerId, status, createdAt.
- `RepositoryRecord`: id, workspaceId, provider, url, defaultBranch, indexedAt.
- `DocumentRecord`: id, workspaceId, objectRef, source, contentType, checksum.
- `DatastoreHealthReport`: name, status, latencyMs, schemaVersion, checkedAt.
- `ObjectRef`: bucket, key, version, checksum, contentType, sizeBytes.

## Testing Plan

- Test each shared datastore client with Testcontainers.
- Test migrations against empty and existing databases.
- Test tenant filters reject cross-workspace access.
- Test object upload and checksum validation against MinIO.
- Test derived index rebuild requests without requiring full index content.

## Acceptance Criteria

- Every store has a clear reason to exist.
- Critical transactional state is not stored only in derived indexes.
- Local developers can start needed stores through profiles.
- Services have typed access patterns and health checks.

## Risks And Mitigations

- Risk: too many datastores increase operational burden. Mitigation: document purpose and add stores only when a phase needs them.
- Risk: derived indexes become sources of truth. Mitigation: define rebuild flows and source-of-truth ownership.
- Risk: tenant leakage. Mitigation: require tenant-scoped repositories and tests.

## Next Phase Handoff

Phase 9 should connect services and datastores through events, outbox records, retry topics, and CDC.
