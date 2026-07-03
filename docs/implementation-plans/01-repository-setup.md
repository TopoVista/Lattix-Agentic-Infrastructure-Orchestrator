# Phase 01 - Repository Setup

## Goal

Create the Lattix enterprise monorepo skeleton with clear boundaries for frontend, backend, AI, data, infrastructure, SDKs, CLI, docs, tests, and operations.

## Why This Phase Exists

The repository structure becomes the map of the platform. A disciplined monorepo makes later phases easier to discover, test, version, and deploy. It also prevents AI, frontend, infrastructure, and service code from growing into disconnected projects.

## Success Criteria

- Repository contains the top-level directories required for all future phases.
- Every major subsystem has a README explaining ownership and conventions.
- Shared naming, package, build, and testing conventions are documented.
- Placeholder service boundaries exist without fake implementation code.
- Root-level license, contribution guide, security policy, and code of conduct are present.

## Deliverables

- Root monorepo folder structure.
- `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.
- `.editorconfig`, `.gitignore`, `.gitattributes`.
- Workspace metadata for Java, TypeScript, Python, and infrastructure.
- Initial docs and ADR folders from phase 0.

## Implemented Artifacts

- [Root README](../../README.md)
- [Contribution guide](../../CONTRIBUTING.md)
- [Security policy](../../SECURITY.md)
- [Code of conduct](../../CODE_OF_CONDUCT.md)
- [License](../../LICENSE)
- [EditorConfig](../../.editorconfig)
- [Git ignore rules](../../.gitignore)
- [Git attributes](../../.gitattributes)
- [TypeScript workspace metadata](../../package.json)
- [pnpm workspace](../../pnpm-workspace.yaml)
- [TypeScript base config](../../tsconfig.base.json)
- [Gradle settings](../../settings.gradle.kts)
- [Python workspace metadata](../../pyproject.toml)
- [Repository manifest](../../lattix.repository.json)
- [Repository manifest utility](../../shared/repository-manifest/README.md)
- [Repository structure checker](../../scripts/repository/check-structure.ps1)

## Folder Structure

```text
lattix/
  frontend/
  mobile/
  gateway/
  services/
  shared/
  agents/
  ai-platform/
  memory/
  knowledge-graph/
  ml-platform/
  vision/
  signal-processing/
  observability/
  cloud/
  terraform/
  kubernetes/
  docs/
  scripts/
  devops/
  benchmarks/
  tests/
  sdk/
  cli/
```

## Modules To Build

- Repository root metadata module.
- Documentation module.
- Application modules: frontend, mobile, gateway, services.
- Intelligence modules: agents, ai-platform, memory, knowledge-graph, ml-platform, vision, signal-processing.
- Platform modules: observability, cloud, terraform, kubernetes, devops.
- Developer interface modules: sdk, cli, scripts, tests, benchmarks.

## Functionality

- Give every subsystem a durable home.
- Establish where shared types, generated clients, test fixtures, and infrastructure modules live.
- Separate product code from deployment code and operational docs.
- Make phase-by-phase growth predictable.

## Tech Stack

- Git.
- Markdown.
- EditorConfig.
- Gradle or Maven workspace conventions for Java services.
- pnpm workspace conventions for TypeScript packages.
- Python workspace conventions for AI services.
- Terraform and Helm directory conventions.

## Implementation Plan

1. Create the root directories listed in the folder structure.
2. Add README files to every top-level directory with purpose, owner type, and future phase dependencies.
3. Add root repository documents and contribution standards.
4. Add `.editorconfig` with common formatting defaults.
5. Add `.gitignore` for Java, Node, Python, Terraform, Kubernetes, IDEs, OS files, logs, secrets, and build output.
6. Add `.gitattributes` for line endings and generated file handling.
7. Document package naming: `com.lattix.<service>` for Java, `@lattix/<package>` for TypeScript, and `lattix_<module>` for Python.
8. Document branch, commit, PR, review, and release conventions.

## Functions / Classes / Interfaces To Implement

```ts
resolveWorkspacePath(input: WorkspacePathInput): WorkspacePath
// Normalizes monorepo-relative paths and rejects traversal outside the repository root.

loadRepositoryManifest(path: string): RepositoryManifest
// Reads root metadata describing modules, owners, language runtimes, and phase ownership.

validateModuleBoundary(input: BoundaryCheckInput): BoundaryCheckResult
// Ensures imports and generated clients follow the documented monorepo boundaries.
```

## Configuration / Environment Variables

- `LATTIX_REPO_ROOT`: absolute path used by scripts and local tooling.
- `LATTIX_ENV`: local, test, staging, or production.
- `LATTIX_CONFIG_DIR`: optional override for local config files.

## Data Models / Schemas / Contracts

- `RepositoryManifest`: name, version, modules, languages, owners, phase map.
- `ModuleDescriptor`: path, type, runtime, owner, public interfaces, dependencies.
- `BoundaryRule`: source module, allowed targets, forbidden targets, enforcement level.

## Testing Plan

- Verify every top-level directory exists.
- Verify every top-level directory has a README.
- Run a path validation script once scripts are introduced.
- Verify `.gitignore` excludes generated artifacts and does not exclude source directories.

## Acceptance Criteria

- A new contributor can navigate the repository without asking where a subsystem belongs.
- Future phases can add implementation files without restructuring the root.
- No secrets, generated binaries, or local caches are intended to be tracked.

## Risks And Mitigations

- Risk: too many directories feel empty. Mitigation: include README purpose statements and phase ownership.
- Risk: later modules ignore boundaries. Mitigation: add boundary validation in phase 2 and CI.
- Risk: monorepo tooling becomes inconsistent. Mitigation: document language-specific workspace conventions now.

## Next Phase Handoff

Phase 2 should add local development tooling, Docker, pre-commit hooks, CI templates, and environment management on top of this skeleton.
