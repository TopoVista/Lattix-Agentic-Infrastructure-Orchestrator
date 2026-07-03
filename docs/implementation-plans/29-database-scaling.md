# Phase 29 - Database Scaling

## Goal

Harden Lattix databases with read replicas, partitioning, sharding strategy, online migrations, backup validation, and scale-aware access patterns.

## Why This Phase Exists

As workspaces, repositories, events, graph facts, memories, metrics, and audit logs grow, single-node assumptions fail. This phase makes data stores scale predictably while preserving correctness, tenant isolation, and operational safety.

## Success Criteria

- Read replica strategy exists for high-read transactional data.
- Partitioning strategy exists for large time-series and event-heavy tables.
- Sharding boundaries are defined for tenants, workspaces, and high-volume datasets.
- Online migration and backfill patterns exist.
- Query performance and replication lag are observable.

## Deliverables

- Database scaling architecture.
- Postgres replica and partitioning plan.
- Sharding strategy document.
- Online migration playbooks.
- Query performance dashboards.
- Backup and restore validation jobs.

## Folder Structure

```text
shared/
  persistence/
    routing/
    migrations/
    partitioning/
    sharding/
devops/
  database/
    backups/
    restore-tests/
    migration-runbooks/
observability/
  dashboards/database/
```

## Modules To Build

- Read/write routing module.
- Partitioning module.
- Sharding policy module.
- Online migration module.
- Backfill module.
- Query performance module.
- Backup validation module.

## Functionality

- Route read-heavy safe queries to replicas.
- Keep writes on primaries.
- Partition high-volume tables by time, workspace, or resource type.
- Define tenant and workspace sharding boundaries.
- Run online migrations with expand, backfill, dual-write, cutover, and cleanup phases.
- Monitor replication lag and slow queries.
- Validate backups through scheduled restore tests.

## Tech Stack

- PostgreSQL read replicas.
- PostgreSQL partitioning.
- PgBouncer.
- Flyway or Liquibase.
- ClickHouse partitioning for analytics.
- Neo4j and Qdrant scaling plans.
- Prometheus database exporters.

## Implementation Plan

1. Classify tables by volume, access pattern, and criticality.
2. Add read/write routing abstraction for safe replica reads.
3. Define partitioning for audit logs, events, metrics summaries, conversation messages, and pipeline runs.
4. Define sharding strategy by workspace or tenant for future growth.
5. Create online migration playbooks with feature flags and rollback.
6. Create backfill framework with checkpointing and throttling.
7. Add query performance dashboards and slow query alerts.
8. Add scheduled restore validation for critical databases.

## Functions / Classes / Interfaces To Implement

```java
DataSource resolveDataSource(QueryIntent intent)
// Routes reads to replicas when safe and writes or strongly consistent reads to primary.

PartitionPlan createPartitionPlan(TableGrowthProfile profile)
// Chooses partition key, interval, retention, indexes, and migration steps for large tables.

ShardKey resolveShardKey(TenantScopedEntity entity)
// Computes future shard placement from tenant, workspace, entity type, and policy.

MigrationRun startOnlineMigration(MigrationPlan plan)
// Runs expand, backfill, dual-write, cutover, validation, and cleanup steps with checkpoints.

BackupValidationReport validateBackupRestore(BackupRef backup)
// Restores backup to isolated environment and verifies integrity and schema version.
```

## Configuration / Environment Variables

- `DATABASE_PRIMARY_URL`
- `DATABASE_REPLICA_URLS`
- `DATABASE_READ_REPLICA_ENABLED`
- `DATABASE_REPLICA_MAX_LAG_MS`
- `MIGRATION_BACKFILL_BATCH_SIZE`
- `MIGRATION_THROTTLE_MS`
- `BACKUP_RESTORE_TEST_ENABLED`

## Data Models / Schemas / Contracts

- `QueryIntent`: consistency, operation, entity, workspaceId, allowReplica.
- `TableGrowthProfile`: table, rowCount, growthRate, queryPatterns, retention.
- `PartitionPlan`: table, key, interval, indexes, retention, migrationSteps.
- `MigrationPlan`: id, phases, validationQueries, rollbackPlan, owner.
- `BackupValidationReport`: backup, status, restoredAt, checks, failures.

## Testing Plan

- Unit tests for datasource routing decisions.
- Migration plan tests for expand and rollback.
- Backfill checkpoint tests.
- Replica lag failover tests with simulated lag.
- Backup restore validation tests in isolated environment.

## Acceptance Criteria

- Read-heavy paths can use replicas safely.
- Large tables have partition and retention plans.
- Online migration playbooks are repeatable.
- Backups are tested, not only created.

## Risks And Mitigations

- Risk: stale replica reads break workflows. Mitigation: consistency-aware query intent and lag checks.
- Risk: migrations corrupt data. Mitigation: expand-contract pattern, checkpoints, validation, rollback.
- Risk: premature sharding complexity. Mitigation: define shard-ready contracts before physically sharding.

## Next Phase Handoff

Phase 30 should handle high-scale traffic with advanced rate limits, adaptive load balancing, and CDN integration.
