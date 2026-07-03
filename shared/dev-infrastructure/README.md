# Development Infrastructure Utilities

## Purpose

Provides executable Phase 02 helper functions for local doctor checks, environment profile loading, commit message validation, and local dependency startup metadata.

## Package

`@lattix/dev-infrastructure`

## Public Functions

- `runDoctorCheck(input)`: verifies local tools and environment files.
- `loadEnvProfile(profile)`: loads the profile definition and example environment variables.
- `validateCommitMessage(message)`: validates Conventional Commit format.
- `startLocalDependency(name)`: returns or executes Docker Compose startup metadata for a dependency profile.
