# Phase 09 - Event Platform

## Goal

Build the Kafka-based event platform that connects Lattix services, agents, indexes, analytics, and automation workflows.

## Why This Phase Exists

Lattix needs reliable asynchronous communication for repository indexing, knowledge graph updates, memory writes, notifications, CI/CD events, observability enrichment, cloud operations, and agent workflows. This phase prevents hidden synchronous coupling and gives later systems a durable integration backbone.

## Success Criteria

- Kafka topics, partitions, retention, keys, schemas, retries, and dead letter queues are documented.
- Outbox pattern exists for transactional event publishing.
- Saga, CQRS, and CDC patterns are defined for future services.
- Event consumers have idempotency, tracing, and error handling standards.
- AsyncAPI documents core events.

## Deliverables

- Topic catalog.
- Shared event library.
- Outbox schema and publisher.
- Retry and DLQ conventions.
- AsyncAPI contract files.
- Consumer template with idempotency and telemetry.

## Folder Structure

```text
shared/
  events/
    contracts/
    producer/
    consumer/
    outbox/
services/
  */src/main/resources/events/
docs/
  architecture/event-contracts.md
```

## Modules To Build

- Event contract module for schemas and AsyncAPI.
- Producer module for publishing with trace and actor context.
- Consumer module for idempotent processing.
- Outbox module for transactional publish.
- Retry module for retry topics and DLQs.
- Saga module for multi-step workflows.
- CDC module for database-to-event synchronization.

## Functionality

- Publish domain events after committed state changes.
- Consume events with idempotency keys and replay safety.
- Route failed events to retry topics and dead letter topics.
- Preserve ordering where required through stable keys.
- Attach trace, actor, workspace, schema version, and causation metadata.
- Support event replay for derived indexes.

## Tech Stack

- Kafka.
- Schema Registry-compatible conventions.
- Avro, JSON Schema, or Protobuf.
- Spring Kafka.
- Kafka Connect for CDC.
- Debezium.
- AsyncAPI.

## Implementation Plan

1. Define topic naming: `lattix.<domain>.<event>.v<version>`.
2. Define standard event envelope and metadata.
3. Create initial topics for auth, workspace, repository, document, index, knowledge, memory, agent, deployment, audit, and notification events.
4. Implement outbox table schema and publisher worker.
5. Implement producer and consumer templates in shared backend.
6. Implement retry topic and DLQ strategy with max attempts and backoff.
7. Define idempotency store for consumers.
8. Add AsyncAPI contracts and schema validation in CI.
9. Add CDC guidelines for Postgres tables that feed analytics and search.

## Functions / Classes / Interfaces To Implement

```java
EventEnvelope<T> wrapEvent(DomainEvent<T> event)
// Adds id, type, version, actor, workspace, causation, correlation, trace, and timestamp metadata.

void saveOutboxEvent(OutboxEvent event)
// Persists an event in the same transaction as the aggregate state change.

PublishResult publishOutboxBatch(int batchSize)
// Reads unpublished outbox records, publishes them to Kafka, and marks durable outcomes.

ConsumerResult processIdempotently(EventEnvelope<?> event)
// Skips already processed events and stores outcome for replay safety.

RetryDecision classifyConsumerFailure(Throwable error)
// Chooses retry, dead-letter, ignore, or alert based on failure type and attempt count.
```

## Configuration / Environment Variables

- `KAFKA_BOOTSTRAP_SERVERS`
- `KAFKA_SECURITY_PROTOCOL`
- `KAFKA_SCHEMA_REGISTRY_URL`
- `EVENT_CONSUMER_GROUP`
- `EVENT_RETRY_MAX_ATTEMPTS`
- `EVENT_RETRY_BACKOFF_MS`
- `OUTBOX_BATCH_SIZE`
- `OUTBOX_POLL_INTERVAL_MS`

## Data Models / Schemas / Contracts

- `EventEnvelope`: id, type, version, key, actor, workspaceId, traceId, causationId, correlationId, occurredAt, payload.
- `OutboxEvent`: id, topic, key, payload, status, attempts, nextAttemptAt, createdAt, publishedAt.
- `ConsumerCheckpoint`: consumerGroup, eventId, outcome, processedAt.
- `DeadLetterEvent`: originalEvent, failureReason, attempts, lastError, createdAt.

## Testing Plan

- Unit tests for event envelope creation and failure classification.
- Integration tests with Kafka Testcontainers.
- Outbox transactional test to ensure state and event commit together.
- Consumer idempotency replay tests.
- Contract tests for AsyncAPI schema compatibility.

## Acceptance Criteria

- Services can publish reliable events without direct Kafka boilerplate.
- Failed events are retried or dead-lettered predictably.
- Consumers are idempotent and traceable.
- Core event contracts are versioned and documented.

## Risks And Mitigations

- Risk: event contracts break consumers. Mitigation: schema compatibility checks and versioned topics.
- Risk: duplicate events cause side effects. Mitigation: idempotency keys and processed-event records.
- Risk: DLQs are ignored. Mitigation: alert on DLQ growth and document replay workflows.

## Next Phase Handoff

Phase 10 should use service APIs and event-backed notifications to build the first user-facing developer workspace.
