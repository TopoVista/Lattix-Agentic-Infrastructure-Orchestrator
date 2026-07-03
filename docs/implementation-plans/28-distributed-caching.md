# Phase 28 - Distributed Caching

## Goal

Harden Lattix caching with Redis Cluster, cache policies, invalidation, warming, fallback behavior, and observability.

## Why This Phase Exists

As Lattix grows, repeated reads from gateway policy checks, knowledge graph queries, chat context, repository metadata, feature flags, and digital twin scenarios can overload primary stores. Distributed caching improves latency and resilience when governed carefully.

## Success Criteria

- Redis Cluster architecture is defined.
- Cache ownership, keys, TTLs, invalidation triggers, and fallback behavior are documented.
- Cache metrics and alerts exist.
- Cache stampede and stale-data risks are mitigated.
- Services use shared cache abstractions.

## Deliverables

- Redis Cluster deployment plan.
- Shared cache client.
- Cache policy registry.
- Invalidation event contracts.
- Cache warming jobs.
- Cache dashboards and alerts.

## Folder Structure

```text
shared/
  cache/
    client/
    policy/
    invalidation/
    metrics/
devops/
  cache/
observability/
  dashboards/cache/
```

## Modules To Build

- Cache client module.
- Cache policy module.
- Key builder module.
- Invalidation module.
- Cache warming module.
- Stampede protection module.
- Cache observability module.

## Functionality

- Cache frequently read workspace, auth policy, repository metadata, graph neighborhoods, chat retrieval, and twin scenario summaries.
- Define cache TTLs by data sensitivity and staleness tolerance.
- Invalidate caches through domain events.
- Warm critical caches after deploy or failover.
- Prevent stampedes through locks, jitter, and request coalescing.
- Fall back to source stores when cache is unavailable.

## Tech Stack

- Redis Cluster.
- Spring Cache or custom Java cache adapter.
- Python Redis client.
- TypeScript API cache helpers where appropriate.
- Kafka invalidation events.
- Prometheus Redis exporter.

## Implementation Plan

1. Define cache categories: identity, workspace, repository, graph, search, chat, twin, config.
2. Define key naming and versioning conventions.
3. Implement shared cache clients with serialization, TTL, jitter, metrics, and tracing.
4. Implement invalidation events for changed workspaces, permissions, repositories, graph facts, memory, and deployments.
5. Implement cache warming for critical startup paths.
6. Add stampede protection and fallback strategy.
7. Add dashboards for hit rate, latency, evictions, memory, errors, and cluster health.
8. Add tests for stale data and invalidation behavior.

## Functions / Classes / Interfaces To Implement

```java
CacheKey buildCacheKey(CacheKeyInput input)
// Builds versioned, tenant-safe keys with namespace, entity, id, and schema version.

Optional<T> getOrLoad(CacheRequest<T> request)
// Reads from cache or source loader with TTL, jitter, locking, metrics, and tracing.

void invalidateCache(CacheInvalidationEvent event)
// Removes or marks stale keys based on domain events and policy registry.

CacheWarmupResult warmCache(CacheWarmupRequest request)
// Preloads frequently used keys after deploy, failover, or scheduled warmup.

CacheHealthReport checkCacheHealth()
// Reports cluster status, latency, errors, evictions, memory, and replication health.
```

## Configuration / Environment Variables

- `REDIS_CLUSTER_NODES`
- `CACHE_DEFAULT_TTL_SECONDS`
- `CACHE_TTL_JITTER_PERCENT`
- `CACHE_LOCK_TTL_SECONDS`
- `CACHE_WARMUP_ENABLED`
- `CACHE_FAIL_OPEN_ENABLED`

## Data Models / Schemas / Contracts

- `CachePolicy`: namespace, ttl, stalenessTolerance, invalidationEvents, sensitivity.
- `CacheKeyInput`: namespace, workspaceId, entityType, entityId, version.
- `CacheInvalidationEvent`: namespace, keys, workspaceId, reason, occurredAt.
- `CacheWarmupRequest`: namespace, scope, priority, maxKeys.
- `CacheHealthReport`: status, nodes, hitRate, latency, errors, evictions.

## Testing Plan

- Unit tests for key building and policy resolution.
- Integration tests with Redis Cluster or compatible local setup.
- Invalidation tests for domain events.
- Stampede simulation tests.
- Failure tests for cache unavailable and stale source data.

## Acceptance Criteria

- Shared cache abstractions are available for services and AI components.
- Cache invalidation is event-driven and observable.
- Cache failures do not break critical flows when source stores are healthy.
- Dashboards show cache health and effectiveness.

## Risks And Mitigations

- Risk: stale permissions are served. Mitigation: short TTL, explicit invalidation, and no cache for high-risk decisions unless policy allows.
- Risk: cache outage causes system outage. Mitigation: source fallback and circuit breakers.
- Risk: key explosion. Mitigation: key policy registry and cardinality monitoring.

## Next Phase Handoff

Phase 29 should scale primary databases with replicas, partitioning, sharding, and online movement strategies.
