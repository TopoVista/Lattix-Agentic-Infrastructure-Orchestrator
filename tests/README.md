# Tests

## Purpose

Contains cross-system tests, fixtures, contract tests, end-to-end scenarios, synthetic workloads, and shared test utilities.

## Owner Type

Quality engineering with shared ownership by feature teams.

## Conventions

- Keep unit tests near source modules when language ecosystems expect that.
- Put cross-system, contract, and end-to-end tests here.
- Fixtures must not contain real secrets or customer data.
- Test names should describe behavior, not implementation details.

## Future Phase Dependencies

- Phase 2 adds CI test conventions.
- Phase 5 adds backend integration test patterns.
- Phase 39 adds SDK and CLI contract tests.
- Phase 40 validates end-to-end production workflows.
