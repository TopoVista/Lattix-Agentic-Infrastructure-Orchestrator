# Phase 06 - API Gateway

## Goal

Build the Lattix API gateway as the secure, observable, rate-limited entry point for frontend, CLI, SDK, webhook, and future agent traffic.

## Why This Phase Exists

The gateway protects backend services from direct exposure and centralizes cross-cutting edge behavior. It should route requests, validate tokens, enforce limits, add tracing, version APIs, and protect services with circuit breakers before user-facing features expand.

## Success Criteria

- Gateway routes to core backend services through versioned routes.
- JWT and OAuth tokens are validated before protected requests reach services.
- Rate limits, request validation, tracing, structured logging, and circuit breakers are active.
- Gateway emits audit and security events for important access decisions.
- Public API versioning policy is documented.

## Deliverables

- `gateway/api-gateway/` Spring Cloud Gateway service.
- Route definitions for core services.
- Auth filter, rate limit filter, validation filter, tracing filter, and error filter.
- Gateway OpenAPI aggregation plan.
- Gateway test suite.

## Folder Structure

```text
gateway/
  api-gateway/
    src/main/java/com/lattix/gateway/
      routing/
      security/
      ratelimit/
      validation/
      tracing/
      errors/
      audit/
```

## Modules To Build

- Routing module for service route definitions and versioned path mapping.
- Security module for JWT validation and principal extraction.
- Rate limit module for token bucket, adaptive limits, and tenant quotas.
- Validation module for request size, headers, content type, and schema checks.
- Resilience module for retries, timeouts, and circuit breakers.
- Observability module for logs, metrics, traces, and audit events.

## Functionality

- Route `/api/v1/auth`, `/api/v1/users`, `/api/v1/workspaces`, `/api/v1/repositories`, `/api/v1/projects`, `/api/v1/tools`, `/api/v1/search`, `/api/v1/knowledge`, `/api/v1/memory`, `/api/v1/documents`, and `/api/v1/analytics`.
- Reject unauthenticated protected requests.
- Enforce per-user, per-workspace, per-token, and per-IP limits.
- Add correlation IDs and trace IDs to all downstream requests.
- Return standard error responses for gateway failures.

## Tech Stack

- Spring Cloud Gateway.
- Spring Security OAuth Resource Server.
- Redis for distributed rate limit counters.
- Resilience4j.
- OpenTelemetry.
- Micrometer.
- JUnit 5 and WebTestClient.

## Implementation Plan

1. Create gateway Spring Boot project.
2. Add route configuration grouped by service and API version.
3. Implement JWT validation and principal extraction.
4. Implement Redis-backed token bucket limits with default tenant quotas.
5. Add adaptive limit hooks for future observability-driven throttling.
6. Add request validation for method, path, headers, payload size, and content type.
7. Add timeouts, retries for safe methods, and circuit breakers.
8. Add access logs, metrics, traces, audit events, and security events.
9. Add integration tests for routing, auth, rate limits, and failure behavior.

## Functions / Classes / Interfaces To Implement

```java
RouteDefinition buildRoute(ServiceRouteConfig config)
// Converts service route metadata into a gateway route with filters and resilience settings.

Authentication validateJwt(String token)
// Validates issuer, audience, signature, expiration, scopes, and workspace claims.

RateLimitDecision evaluateRateLimit(RateLimitRequest request)
// Applies token bucket and tenant quota rules before routing a request.

GatewayAuditEvent createAuditEvent(ServerWebExchange exchange, AccessDecision decision)
// Records actor, route, decision, status, latency, and reason without logging secrets.

Throwable mapGatewayFailure(Throwable error)
// Converts timeout, circuit breaker, auth, validation, and downstream failures to stable errors.
```

## Configuration / Environment Variables

- `GATEWAY_PORT`
- `JWT_ISSUER_URI`
- `JWT_AUDIENCE`
- `REDIS_URL`
- `DEFAULT_RATE_LIMIT_PER_MINUTE`
- `GATEWAY_REQUEST_TIMEOUT_MS`
- `OTEL_EXPORTER_OTLP_ENDPOINT`

## Data Models / Schemas / Contracts

- `ServiceRouteConfig`: id, path, serviceUri, version, authRequired, scopes, timeout, retries.
- `RateLimitRequest`: actorId, workspaceId, tokenId, ip, route, cost.
- `RateLimitDecision`: allowed, remaining, resetAt, reason.
- `GatewayAuditEvent`: actor, workspace, route, method, decision, status, latency, traceId.

## Testing Plan

- Unit tests for JWT validation and rate limit logic.
- WebTestClient route tests for each configured service.
- Integration test with Redis for distributed rate limits.
- Failure tests for timeout, downstream error, invalid token, and invalid content type.
- Load smoke test for gateway latency overhead.

## Acceptance Criteria

- Protected routes cannot be reached without valid auth.
- Limits are enforced consistently across gateway instances.
- Every request has trace, log, and audit context.
- Downstream failures do not expose internal stack traces.

## Risks And Mitigations

- Risk: gateway becomes a business logic layer. Mitigation: restrict it to routing, policy, and edge concerns.
- Risk: rate limits block legitimate work. Mitigation: expose headers and configurable tenant quotas.
- Risk: auth claims drift from services. Mitigation: share principal contract with backend foundation.

## Next Phase Handoff

Phase 7 should implement the identity and authorization services that issue, validate, and govern the tokens enforced by the gateway.
