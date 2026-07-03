# CLI

## Purpose

Contains the Lattix command-line interface for authentication, workspace selection, repository operations, chat, agent tasks, pipelines, cloud plans, audit exports, and administrative workflows.

## Owner Type

Developer experience.

## Conventions

- CLI commands must use public gateway APIs and SDKs.
- Risky commands should plan first and require explicit confirmation or approval.
- Output should support human-readable and machine-readable modes.
- CLI configuration must not store raw secrets.

## Future Phase Dependencies

- Phase 39 implements the CLI.
- Phase 40 validates production support and customer onboarding workflows.
