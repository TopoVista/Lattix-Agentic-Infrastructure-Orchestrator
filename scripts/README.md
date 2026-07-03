# Scripts

## Purpose

Contains local development, validation, CI helper, repository maintenance, and operational scripts.

## Owner Type

Developer experience and platform engineering.

## Conventions

- Scripts should be idempotent where practical.
- Scripts must not print secrets.
- Prefer explicit arguments over hidden environment assumptions.
- PowerShell scripts should support Windows development.
- Cross-platform scripts should document shell requirements.

## Future Phase Dependencies

- Phase 1 adds repository structure validation.
- Phase 2 expands local development and CI scripts.
- Later phases add operational scripts for DR, benchmarks, and release gates.
