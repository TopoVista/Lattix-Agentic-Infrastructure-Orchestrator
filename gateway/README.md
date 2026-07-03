# Gateway

## Purpose

Hosts API gateway and edge policy services for routing, authentication enforcement, rate limiting, request validation, tracing, API versioning, and circuit breakers.

## Owner Type

Platform engineering.

## Conventions

- Java packages use `com.lattix.gateway`.
- Gateway code must not contain business domain logic.
- Public APIs enter through `/api/v<major>/`.
- Every request should preserve trace, correlation, actor, and workspace context.
- Route definitions must map to documented service ownership.

## Future Phase Dependencies

- Phase 5 creates backend service foundations.
- Phase 6 implements Spring Cloud Gateway.
- Phase 30 expands advanced traffic control.
