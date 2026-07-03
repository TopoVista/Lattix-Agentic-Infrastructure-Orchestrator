# Services

## Purpose

Contains core Spring Boot backend microservices for auth, users, workspaces, repositories, projects, notifications, tools, search, knowledge, memory, documents, analytics, logging, and monitoring.

## Owner Type

Backend platform and product service teams.

## Conventions

- Java packages use `com.lattix.<service>`.
- Services own their transactional state and publish domain events after committed state changes.
- Services must use shared web, security, tracing, event, and error contracts from `shared/`.
- Cross-service integration should use APIs or events, not direct database reads.
- Service names should end with `-service`.

## Future Phase Dependencies

- Phase 5 creates the backend foundation.
- Phase 7 implements authentication and authorization.
- Phase 8 adds datastore integration.
- Phase 9 adds event integration.
