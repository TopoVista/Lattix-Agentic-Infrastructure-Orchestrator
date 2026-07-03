# Phase 05 - Backend Foundation

## Goal

Create the Spring Boot backend foundation and service conventions for Lattix microservices.

## Why This Phase Exists

Backend services are the control plane for users, workspaces, repositories, projects, tools, knowledge, memory, notifications, analytics, logging, and monitoring. Shared conventions prevent every service from solving authentication, validation, errors, telemetry, configuration, and persistence differently.

## Success Criteria

- Spring Boot service template exists.
- Core services are scaffolded with APIs, health checks, config, logging, validation, and test conventions.
- Shared backend libraries define errors, tracing, auth context, event publishing, pagination, and DTO rules.
- Gateway-facing contracts are documented.

## Status (implementation progress)

- Service template (`services/_template`): Implemented (health, readiness, OpenAPI starter, test skeleton).
- Core service shells: Implemented for auth, user, workspace, repository, project, notification, tool, search, knowledge, memory, document, analytics, logging, monitoring (scaffolded with health endpoints and OpenAPI starter).
- Shared backend (`shared/backend`): Implemented (`web` ApiResponse/ErrorResponse/PageResponse, `errors`, basic `security` utilities, `events` placeholders, `RestExceptionHandler`).
- Shared tracing: Implemented as `shared/tracing` with `TraceUtils` (OpenTelemetry API wiring placeholder).
- Shared events: Implemented as `shared/events` with a `KafkaEventPublisher` placeholder; real Kafka wiring remains service-specific.
- Shared persistence: Implemented as `shared/persistence` with a Flyway migration template (`V1__init.sql`).
- Shared test utilities: Implemented as `shared/test` providing `TestSecurityConfig` (auto-configured under `test` profile) to allow health tests to run without authentication.
- Integration test base: Implemented as `shared/integration-test` with a PostgreSQL Testcontainers `IntegrationTestBase` that exposes datasource properties for tests.
- Gradle multi-project: Updated `settings.gradle.kts` and root `build.gradle.kts` to include and wire new shared modules and test dependencies.

## Remaining / Manual Work

- OpenTelemetry runtime agent configuration and automatic trace exporter setup (per-environment OTEL agent and exporter configuration).
- Full Kafka integration and outbox pattern wiring in services that require events (the shared publisher is a placeholder).
- Enforce OpenAPI contract validation in CI (automatic spec checks and contract tests are not yet added).
- Per-service Flyway/Liquibase migration workflows and example database schemas beyond the provided template.
- More complete integration-test coverage (service-specific Testcontainers setups, WireMock stubs, and smoke tests for DB-backed services).
- Per-service Helm chart `values.yaml` tailored to each service (base charts exist under `kubernetes/charts/lattix-service` but per-service overlays should be populated).

## Next Recommended Steps

1. Add per-service integration tests using `shared/integration-test` and restore JPA only for services that own a database.
2. Wire Kafka (or alternative event transport) into services that publish events and implement the outbox pattern where required.
3. Add OpenAPI validation step to CI and generate canonical API specs from `springdoc` during builds.
4. Populate Helm `values.yaml` for each service and add `Dockerfile` best-practices checklist to the template.
5. Commit and push these changes to the repository and run full CI to validate.

## Deliverables

- Service template under `services/_template/`.
- Core service folders: auth, user, workspace, repository, project, notification, tool, search, knowledge, memory, document, analytics, logging, monitoring.
- Shared backend package under `shared/backend/`.
- Common OpenAPI conventions.
- Integration test pattern.

## Folder Structure

```text
services/
  auth-service/
  user-service/
  workspace-service/
  repository-service/
  project-service/
  notification-service/
  tool-service/
  search-service/
  knowledge-service/
  memory-service/
  document-service/
  analytics-service/
  logging-service/
  monitoring-service/
shared/
  backend/
    errors/
    security/
    tracing/
    events/
    web/
```

## Modules To Build

- Service template module.
- Shared web module for controllers, pagination, validation, and error responses.
- Shared security module for authenticated principal and permission checks.
- Shared tracing module for OpenTelemetry context propagation.
- Shared events module for Kafka publishing and outbox integration.
- Shared persistence module for transactional patterns.

## Functionality

- Expose health, readiness, liveness, and version endpoints.
- Standardize API responses, validation errors, correlation IDs, and audit metadata.
- Support service-to-service auth context propagation.
- Provide consistent event publishing and future outbox support.
- Provide service-specific database migration conventions.

## Tech Stack

- Java 21.
- Spring Boot.
- Spring Web.
- Spring Security.
- Spring Validation.
- Spring Data.
- Flyway or Liquibase.
- OpenTelemetry Java agent.
- JUnit 5, Testcontainers, WireMock.

## Implementation Plan

1. Create shared backend libraries for web, security, tracing, events, errors, and persistence.
2. Create service template with standard package layout, application config, health checks, and tests.
3. Scaffold core services with empty but valid application shells.
4. Add OpenAPI generation and validation conventions.
5. Add database migration folder convention for services that own SQL state.
6. Add integration test base using Testcontainers.
7. Add service Dockerfile template.
8. Add Kubernetes chart values for each service.

## Functions / Classes / Interfaces To Implement

```java
ApiResponse<T> success(T data)
// Wraps successful API responses with request id, timestamp, and data.

ErrorResponse mapException(Throwable error)
// Converts validation, auth, domain, and infrastructure exceptions to stable API errors.

CurrentPrincipal requirePrincipal()
// Reads authenticated user, tenant, roles, attributes, and request context.

DomainEventPublisher.publish(DomainEvent event)
// Publishes domain events through the configured event transport and records audit metadata.

PageResponse<T> toPageResponse(Page<T> page)
// Converts persistence pagination into the standard API pagination contract.
```

## Configuration / Environment Variables

- `SERVER_PORT`
- `SPRING_PROFILES_ACTIVE`
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `KAFKA_BOOTSTRAP_SERVERS`
- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `LATTIX_SERVICE_NAME`
- `LATTIX_ENV`

## Data Models / Schemas / Contracts

- `ApiResponse`: requestId, timestamp, data, meta.
- `ErrorResponse`: requestId, timestamp, code, message, details, retryable.
- `CurrentPrincipal`: userId, workspaceId, roles, attributes, sessionId.
- `DomainEvent`: id, type, version, aggregateId, occurredAt, actor, payload.

## Testing Plan

- Unit tests for shared error, response, auth context, and event utilities.
- Contract tests for standard API error shapes.
- Integration tests for service startup and health endpoints.
- Testcontainers smoke test for services with database access.
- Static checks for package naming and dependency boundaries.

## Acceptance Criteria

- A new Spring service can be created from the template in less than one hour.
- Every scaffolded service starts with health endpoints and telemetry.
- Shared libraries are used for common concerns.
- No service invents a private error or auth context contract.

## Risks And Mitigations

- Risk: too much shared library abstraction too early. Mitigation: keep shared code focused on cross-cutting concerns only.
- Risk: service sprawl. Mitigation: scaffold boundaries but implement business logic only when phases require it.
- Risk: inconsistent contracts. Mitigation: enforce OpenAPI and shared response types in CI.

## Next Phase Handoff

Phase 6 should place Spring Cloud Gateway in front of these services and enforce security, rate limits, tracing, and routing.

## Implemented Artifacts

- Service baseline: `services/_template` includes standard health/readiness/liveness endpoints, Dockerfile, OpenAPI starter, and tests.
- Core service shells: scaffolded service modules under `services/*-service` with shared contracts and health checks.
- Shared backend contracts: `shared/backend` (`ApiResponse`, `ErrorResponse`, pagination, exception handling, principal utilities).
- Cross-cutting foundations: `shared/events`, `shared/tracing`, `shared/persistence`, `shared/test`, and `shared/integration-test`.
- Build/test enforcement: Gradle multi-project wiring in `settings.gradle.kts` and CI execution in `.github/workflows/ci.yml`.
- Repository policy: structure enforcement for Phase 05 artifacts in `scripts/repository/check-structure.ps1`.
