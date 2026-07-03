# Phase 02 - Development Infrastructure

## Goal

Make Lattix easy to run, test, lint, format, and validate locally and in CI.

## Why This Phase Exists

Large platforms fail early when development setup is fragile. This phase creates the developer experience foundation so every later phase can add code without inventing local runtime, hook, environment, and CI patterns from scratch.

## Success Criteria

- Local development can start through documented commands.
- Docker and Docker Compose support core local dependencies.
- Dev containers and VS Code workspace settings are available.
- Pre-commit hooks enforce formatting, linting, secrets checks, and commit conventions.
- CI templates exist for build, test, scan, docs, and infrastructure validation.

## Deliverables

- `docker-compose.yml` for local dependencies.
- `.devcontainer/devcontainer.json`.
- `.vscode/extensions.json` and `.vscode/settings.json`.
- `.pre-commit-config.yaml`.
- Commitlint and conventional commit config.
- CI workflow templates under `.github/workflows/`.
- Environment examples under `config/env/`.

## Folder Structure

```text
.devcontainer/
.github/
  workflows/
.vscode/
config/
  env/
scripts/
  dev/
  ci/
devops/
  hooks/
```

## Modules To Build

- Local runtime module for Docker Compose.
- Development shell module for repeatable commands.
- Hook module for pre-commit and commit message validation.
- CI template module for GitHub Actions.
- Environment module for `.env.example` and service-specific env files.

## Functionality

- Start Postgres, Redis, Kafka, MinIO, Neo4j, Qdrant, ClickHouse, and OpenSearch locally as needed.
- Validate formatting and linting before commits.
- Detect secrets before they enter Git.
- Standardize environment variables and local overrides.
- Provide CI workflows that later services can plug into.

## Tech Stack

- Docker and Docker Compose.
- Optional local Kubernetes through kind or k3d.
- Tilt for multi-service development once Kubernetes services exist.
- Dev Containers.
- Pre-commit.
- GitHub Actions.
- Commitlint.
- Secret scanning with gitleaks or equivalent.

## Implementation Plan

1. Add local Docker Compose with profiles for databases, messaging, observability, and AI services.
2. Add devcontainer configuration with Java 21, Node LTS, Python, Docker CLI, Terraform, kubectl, Helm, and common tooling.
3. Add VS Code recommended extensions for Java, TypeScript, Python, Docker, Terraform, Kubernetes, Markdown, and YAML.
4. Add pre-commit hooks for whitespace, markdown, YAML, JSON, Java, TypeScript, Python, Terraform, and secrets.
5. Add commit message validation for conventional commits.
6. Add CI templates for pull request validation.
7. Add environment examples and document secret loading rules.
8. Add scripts for setup, doctor checks, local dependency startup, and CI parity.

## Functions / Classes / Interfaces To Implement

```ts
runDoctorCheck(input: DoctorCheckInput): DoctorCheckReport
// Verifies required local tools, versions, ports, environment files, and Docker availability.

loadEnvProfile(profile: string): EnvProfile
// Merges base, local, and service-specific environment variables without exposing secret values.

validateCommitMessage(message: string): CommitValidationResult
// Enforces conventional commit type, scope, description, and breaking change metadata.

startLocalDependency(name: DependencyName): DependencyStatus
// Starts a Docker Compose service profile and reports health check status.
```

## Configuration / Environment Variables

- `LATTIX_ENV=local`
- `LATTIX_PROFILE=core`
- `POSTGRES_URL`
- `REDIS_URL`
- `KAFKA_BOOTSTRAP_SERVERS`
- `MINIO_ENDPOINT`
- `NEO4J_URI`
- `QDRANT_URL`
- `OPENSEARCH_URL`

## Data Models / Schemas / Contracts

- `EnvProfile`: name, files, variables, secret references, enabled services.
- `DoctorCheckReport`: tool checks, version checks, port checks, env checks, failures.
- `LocalDependency`: name, compose profile, ports, health endpoint, dependent phases.

## Testing Plan

- Run `docker compose config` to validate Compose syntax.
- Run pre-commit hooks against the repository.
- Run CI workflows in dry-run mode if tooling supports it.
- Run doctor script on a clean machine profile.
- Validate env examples contain no real secrets.

## Acceptance Criteria

- A new developer can follow docs and reach a healthy local environment.
- Hooks catch formatting, invalid commits, and secrets.
- CI templates are ready to be extended by service-specific builds.
- Local runtime is profile-based so developers do not need every heavy dependency at once.

## Risks And Mitigations

- Risk: local environment becomes too heavy. Mitigation: use Compose profiles and document minimum profiles.
- Risk: secrets leak through env examples. Mitigation: enforce examples only and secret scanning.
- Risk: hooks slow development. Mitigation: keep fast checks pre-commit and heavier checks in CI.

## Next Phase Handoff

Phase 3 should use the same environment and validation conventions while adding Terraform-managed cloud infrastructure.

## Implemented Artifacts

- Local runtime: `docker-compose.yml` with profile-based data, messaging, AI, search, and observability services.
- Reproducible workspace: `.devcontainer/devcontainer.json`, `.vscode/extensions.json`, and `.vscode/settings.json`.
- Quality gates: `.pre-commit-config.yaml`, `.yamllint.yml`, `commitlint.config.cjs`, and GitHub Actions workflows.
- Environment contracts: `config/env/*.env.example` and `config/env/profiles.json`.
- Developer automation: `scripts/dev/*.ps1`, `scripts/ci/run-local-ci.ps1`, and `shared/dev-infrastructure`.
- Repository enforcement: `scripts/repository/check-structure.ps1` validates every required Phase 02 artifact.
