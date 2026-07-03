# Shared

## Purpose

Holds cross-language contracts, schemas, shared utilities, generated clients, and reusable platform libraries.

## Owner Type

Platform engineering with shared ownership from backend, frontend, AI, and DevOps teams.

## Conventions

- Shared code must be stable, well-documented, and broadly useful.
- Avoid dumping service-specific business logic here.
- Generated clients must live in clearly named generated directories.
- Contracts should be versioned when used by multiple subsystems.
- TypeScript packages use `@lattix/<package>`, Java packages use `com.lattix.shared`, and Python packages use `lattix_shared`.

## Future Phase Dependencies

- Phase 1 adds repository manifest utilities.
- Phase 5 adds shared backend contracts.
- Phase 9 adds event contracts.
- Later phases add AI, memory, tool, cloud, cost, and compliance contracts.
