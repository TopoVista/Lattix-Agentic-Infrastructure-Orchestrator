# SDK

## Purpose

Contains public SDKs, generated clients, contract tests, examples, and versioned developer interfaces.

## Owner Type

Developer experience.

## Conventions

- SDKs must follow semantic versioning.
- SDKs must use public gateway APIs, not internal service APIs.
- Generated clients must be reproducible from OpenAPI or AsyncAPI contracts.
- Language SDKs should live under `sdk/typescript/`, `sdk/java/`, and `sdk/python/`.

## Future Phase Dependencies

- Phase 39 implements SDKs and documentation portal support.
- Phase 40 validates production onboarding and support flows.
