# Lattix

Lattix is an AI-native agentic infrastructure orchestrator. It is designed as an engineering control plane that connects code, cloud, CI/CD, observability, knowledge, memory, data, ML, and multi-agent workflows into one explainable platform.

## Current Phase

This repository is currently implementing the documented roadmap in `docs/implementation-plans/`.

- Phase 00 implemented product, architecture, security, operations, and diagram design artifacts.
- Phase 01 establishes the enterprise monorepo skeleton, governance files, workspace metadata, and module boundaries.

## Repository Map

| Path | Purpose |
| --- | --- |
| `frontend/` | Web applications and browser-based product surfaces |
| `mobile/` | Future mobile or companion clients |
| `gateway/` | API gateway and edge policy services |
| `services/` | Core Spring Boot backend microservices |
| `shared/` | Cross-language shared contracts, utilities, schemas, and generated clients |
| `agents/` | Agent runtime, role agents, evaluators, recovery, and approval flows |
| `ai-platform/` | AI services, repository intelligence, chat pipeline, and code generation |
| `memory/` | Working, semantic, long-term, procedural, and organizational memory |
| `knowledge-graph/` | Graph schemas, importers, and query APIs |
| `ml-platform/` | Training, model registry, serving, evaluation, and monitoring |
| `vision/` | Computer vision services for diagrams, OCR, screenshots, and UI understanding |
| `signal-processing/` | Audio, speech, meeting, alarm, and signal analysis services |
| `observability/` | Metrics, logs, traces, dashboards, alerts, and SLO definitions |
| `cloud/` | Cloud provider adapters and cloud controller code |
| `terraform/` | Terraform environments and reusable infrastructure modules |
| `kubernetes/` | Kubernetes, Helm, mesh, policy, and environment manifests |
| `docs/` | Product, architecture, security, operations, and implementation plans |
| `scripts/` | Local development, repository validation, CI, and operational scripts |
| `devops/` | CI/CD, release, scans, deployment, DR, chaos, and operations assets |
| `benchmarks/` | Performance, load, stress, soak, and capacity benchmarks |
| `tests/` | Cross-system tests, fixtures, contracts, and end-to-end scenarios |
| `sdk/` | Public SDKs and generated clients |
| `cli/` | Lattix command-line interface |

## Naming Conventions

- Java packages use `com.lattix.<service>`.
- TypeScript packages use `@lattix/<package>`.
- Python packages use `lattix_<module>`.
- Kafka topics use `lattix.<domain>.<event-name>.v<major-version>`.
- Environment variables use `LATTIX_` for platform-wide values and service-specific prefixes for runtime services.

## Workspace Metadata

- TypeScript workspace: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`.
- Java workspace: `settings.gradle.kts`, `build.gradle.kts`, `gradle.properties`.
- Python workspace: `pyproject.toml`.
- Repository module map: `lattix.repository.json`.

## Useful Commands

```powershell
pwsh -NoProfile -File scripts/repository/check-structure.ps1
```

The structure check validates the Phase 01 module skeleton, README coverage, manifest paths, and required root metadata.

## Design Documents

- [Product vision](docs/product/vision.md)
- [Product requirements](docs/product/prd.md)
- [System context](docs/architecture/system-context.md)
- [API design](docs/architecture/api-design.md)
- [Database design](docs/architecture/database-design.md)
- [Event contracts](docs/architecture/event-contracts.md)
- [Threat model](docs/security/threat-model.md)
- [Cost estimate](docs/operations/cost-estimate.md)

## Contribution

Read [CONTRIBUTING.md](CONTRIBUTING.md) before adding code, services, packages, infrastructure, or generated artifacts.
