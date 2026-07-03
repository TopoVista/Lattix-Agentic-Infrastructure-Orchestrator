# Repository Manifest Utilities

## Purpose

Provides the Phase 01 utility functions for repository path resolution, manifest loading, and documented module boundary checks.

## Package

`@lattix/repository-manifest`

## Public Functions

- `resolveWorkspacePath(input)`: normalizes a path and rejects traversal outside the repository root.
- `loadRepositoryManifest(path)`: reads and validates the root `lattix.repository.json` manifest.
- `validateModuleBoundary(input)`: checks source and target module relationships against manifest boundary rules.

## Notes

This package is intentionally small. It gives later tooling a stable contract without inventing a full build system in Phase 01.
