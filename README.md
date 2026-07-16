# Lattix

> **AI-Native Agentic Infrastructure Orchestrator** — 40-phase enterprise platform connecting code, cloud, CI/CD, AI agents, knowledge, memory, and observability into one explainable control plane.

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](.) [![Tests](https://img.shields.io/badge/tests-341%20passing-brightgreen)](.) [![Phases](https://img.shields.io/badge/phases-40%2F40-blue)](docs/implementation-plans/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](.) [![Python](https://img.shields.io/badge/Python-3.12-blue)](.) [![Java](https://img.shields.io/badge/Java-21-orange)](.)

---

## 🚀 Quick Start

```powershell
# Install dependencies
pnpm install --no-frozen-lockfile

# Start the web UI
cd frontend/apps/web
pnpm dev
# → http://localhost:3000
```

**→ Full guide: [docs/USER_GUIDE.md](docs/USER_GUIDE.md)**

---

## What Is Lattix?

Lattix is an AI engineering platform that gives developers, AI agents, and operations teams a unified control plane for:

| Capability | What it does |
|-----------|-------------|
| **Intelligent Code Editor** | Monaco editor with AI suggestions, symbol navigation, AST view |
| **Repository Intelligence** | Indexes codebases into structural graphs for AI consumption |
| **Code Completion Engine** | Repository-aware code, test, API, and config generation |
| **Knowledge Graph** | Neo4j graph connecting code, people, infra, incidents, and decisions |
| **Memory System** | 5-tier memory: working, semantic, long-term, procedural, organizational |
| **Multi-Agent Platform** | Supervisor, planner, executor, reflector, evaluator, recovery agents |
| **MCP Tool Ecosystem** | Model Context Protocol servers: filesystem, git, web, code exec, DB |
| **Intelligent Chatbot** | Intent → planning → retrieval → reasoning → verification pipeline |
| **AI Software Engineers** | Specialized role agents: code reviewer, ops, security, ML, incident |
| **Digital Twin** | Living model of system topology, costs, incidents, and deployments |
| **Observability** | OTel metrics, structured logs, distributed traces, alert rules |
| **CI/CD Platform** | Build, test, scan, AI review, deploy, canary, blue-green |
| **Security & Compliance** | Zero trust, secrets, supply chain, SOC2, GDPR, ISO 27001 |
| **Chaos Engineering** | Fault injection, resilience experiments, safety controls |

---

## Platform Portal — All 40 Phases

Open **http://localhost:3001/platform** to explore every phase:

```
/platform                    Phase 0-40 overview grid
/platform/ai                 AI Core (Phases 10-19)
/platform/infrastructure     Cloud, K8s, CI/CD (Phases 3-7, 24-25, 32-33)
/platform/observability      Metrics, Logs, Traces, Alerts (Phase 26)
/platform/digital-twin       System topology + Cost model (Phases 27, 38)
/platform/data               Data Engineering + ML (Phases 8, 20-23)
/platform/reliability        Chaos + Performance + DR (Phases 28-34, 37, 40)
/platform/security           Security + Compliance (Phases 7, 35-36)
/platform/enterprise         Cost, Docs, Production Readiness (Phases 37-40)
```

---

## Repository Map

```
lattix/
├── frontend/apps/web/          Next.js web application (Phase 10-11)
│   ├── src/app/                Next.js routes
│   │   ├── platform/           Platform Portal (all 40 phases)
│   │   └── repositories/       Workspace views
│   ├── src/components/
│   │   ├── platform/           Phase feature panels
│   │   └── workspace/          Workspace UI components
│   └── src/lib/                Store, API client, types
│
├── agents/                     Multi-agent platform (Phase 16)
│   ├── lattix_agents/          Core runtime modules
│   └── roles/                  Specialized AI engineer roles
│
├── ai-platform/                AI services (Phases 12-13, 18)
│   ├── repository-intelligence/ Code indexing
│   ├── code-completion/        Generation engine
│   └── chat-pipeline/          Chatbot pipeline
│
├── knowledge-graph/            Graph database (Phase 14)
│   ├── lattix_knowledge_graph/ Python modules
│   └── importers/              Data importers
│
├── memory/                     Memory system (Phase 15)
│   └── lattix_memory/          5-tier memory modules
│
├── services/                   Spring Boot microservices (Phases 5-9)
│   ├── auth-service/           Authentication & RBAC
│   ├── workspace-service/      Workspace management
│   ├── repository-service/     Repository indexing
│   ├── tool-service/           MCP tool server
│   └── [12 more services]/
│
├── observability/              Metrics, logs, traces (Phase 26)
├── digital-twin/               Living system model (Phase 27)
├── cloud/                      Cloud controllers (Phase 24)
├── devops/                     CI/CD, chaos, DR (Phases 25, 32, 34)
├── ml-platform/                ML training & serving (Phase 21)
├── vision/                     Computer vision (Phase 22)
├── signal-processing/          Audio & speech (Phase 23)
├── terraform/                  Cloud IaC (Phase 3)
├── kubernetes/                 K8s manifests (Phase 4)
├── security/                   Security configs (Phase 35)
├── compliance/                 Compliance automation (Phase 36)
├── cost-optimization/          Cost engine (Phase 38)
├── data-platform/              Data engineering (Phase 20)
├── sdk/                        Public SDKs (Phase 39)
├── cli/                        Lattix CLI (Phase 39)
├── tests/                      All test suites
└── docs/                       Implementation plans + design docs
    ├── USER_GUIDE.md            ← Complete how-to guide
    └── implementation-plans/   Phase 0-40 blueprints
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Zustand, Monaco Editor |
| Backend | Spring Boot 3, Java 21 |
| AI Services | FastAPI, Python 3.12 |
| Code Analysis | Tree-sitter, LLVM, pybind11 |
| Messaging | Apache Kafka 3.9 (KRaft) |
| Cache | Redis 7 Cluster |
| SQL | PostgreSQL 16 |
| Graph | Neo4j 5 |
| Vector | Qdrant |
| Analytics | ClickHouse |
| Object Storage | MinIO (local), S3 (cloud) |
| Search | OpenSearch |
| ML | PyTorch, HuggingFace, MLflow |
| Vision | OpenCV, YOLO, Detectron2 |
| Speech | Whisper, pyannote.audio |
| Observability | OTel, Prometheus, Grafana, Jaeger, Loki |
| CI/CD | GitHub Actions, ArgoCD |
| Cloud | AWS (primary), GCP (secondary), Azure (ready) |
| IaC | Terraform, Helm |
| Containers | Docker, Kubernetes |

---

## Running Tests

```powershell
# Frontend (Vitest) — 3/3 passing
cd frontend/apps/web && pnpm test

# Python suite — 341 tests passing
.\.venv\Scripts\Activate.ps1
python -m pytest tests/ -q

# TypeScript type check — 0 errors
cd frontend/apps/web && npx tsc --noEmit
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [USER_GUIDE.md](docs/USER_GUIDE.md) | **How to use every feature** |
| [Product Vision](docs/product/vision.md) | Product philosophy |
| [PRD](docs/product/prd.md) | Product requirements |
| [System Context](docs/architecture/system-context.md) | Architecture overview |
| [API Design](docs/architecture/api-design.md) | API contracts |
| [Database Design](docs/architecture/database-design.md) | Data models |
| [Threat Model](docs/security/threat-model.md) | Security analysis |
| [Implementation Plans](docs/implementation-plans/) | Phase 0–40 blueprints |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Naming conventions:
- Java: `com.lattix.<service>`
- TypeScript: `@lattix/<package>`
- Python: `lattix_<module>`
- Kafka topics: `lattix.<domain>.<event>.v<N>`
- Env vars: `LATTIX_` prefix

---

*Lattix © 2026 — AI-native engineering control plane*
