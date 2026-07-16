# Lattix — Complete User Guide

> **AI-Native Agentic Infrastructure Orchestrator** · 40 phases · Phase 0–40 fully implemented

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Web UI — Feature by Feature](#2-web-ui--feature-by-feature)
3. [Platform Portal — All 40 Phases](#3-platform-portal--all-40-phases)
4. [Terminal](#4-terminal)
5. [Repository Browser & Code Editor](#5-repository-browser--code-editor)
6. [Task Board](#6-task-board)
7. [Git Panel](#7-git-panel)
8. [Notifications](#8-notifications)
9. [Account Management](#9-account-management)
10. [AI Core Features](#10-ai-core-features)
11. [Knowledge Graph](#11-knowledge-graph)
12. [Memory System](#12-memory-system)
13. [Multi-Agent Platform & AI Engineers](#13-multi-agent-platform--ai-engineers)
14. [MCP Tool Ecosystem](#14-mcp-tool-ecosystem)
15. [Observability](#15-observability)
16. [Digital Twin](#16-digital-twin)
17. [Infrastructure & CI/CD](#17-infrastructure--cicd)
18. [Security & Compliance](#18-security--compliance)
19. [Data & ML Platform](#19-data--ml-platform)
20. [Reliability & Chaos Engineering](#20-reliability--chaos-engineering)
21. [Running Tests](#21-running-tests)
22. [CLI & SDK](#22-cli--sdk)
23. [Keyboard Shortcuts & Tips](#23-keyboard-shortcuts--tips)

---

## 1. Quick Start

### Prerequisites
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Frontend |
| pnpm | 9+ | Package manager |
| Python | 3.12+ | AI services & tests |
| Docker Desktop | Latest | Infrastructure services |
| Git | 2.40+ | Version control |

### Start Everything

```powershell
# 1. Clone / open the repo
cd "C:\Users\KIIT0001\Desktop\lattix - agentic infrastructure orchestrator"

# 2. (Optional) Start core infrastructure (Postgres, Redis, Kafka, MinIO)
docker compose --profile core up -d

# 3. Install JS dependencies (first time only)
pnpm install --no-frozen-lockfile

# 4. Start the web UI
cd frontend/apps/web
pnpm dev
```

**Open → http://localhost:3000** (or 3001 if 3000 is in use)

### Activate Python Environment
```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Bash / Git Bash
source .venv/Scripts/activate
```

---

## 2. Web UI — Feature by Feature

The web UI is organized into two areas:

### Workspace (left sidebar — top section)
| Nav Item | URL | What It Does |
|----------|-----|-------------|
| Dashboard | `/` | Overview: repos, tasks, notifications, activity |
| Repository | `/repositories/repo-platform` | Browse real filesystem |
| Editor | `?view=editor` | Monaco code editor with AI suggestions |
| Git | `?view=git` | Real git log & branches from your repo |
| Terminal | `?view=terminal` | Live shell — runs actual commands |
| Docs | `?view=docs` | Documentation links |
| Notifications | `?view=notifications` | Dismissable, filterable alerts |
| Tasks | `?view=tasks` | Kanban board with full CRUD |

### Platform Portal (left sidebar — bottom section, 🚀 icon)
| Nav Item | URL | Phases |
|----------|-----|--------|
| Phase Overview | `/platform` | All 41 phases |
| AI Core | `/platform/ai` | P10–19 |
| Infrastructure | `/platform/infrastructure` | P3–7, 24–25, 32–33 |
| Observability | `/platform/observability` | P26 |
| Digital Twin | `/platform/digital-twin` | P27, 38 |
| Data & ML | `/platform/data` | P8, 20–23 |
| Reliability | `/platform/reliability` | P28–34, 37, 40 |
| Security | `/platform/security` | P7, 35–36 |
| Enterprise | `/platform/enterprise` | P37–40 |

---

## 3. Platform Portal — All 40 Phases

Navigate to **http://localhost:3001/platform**

### Phase Overview Grid
- Shows all **41 phase cards** (Phase 0–40)
- Each card shows: phase number, title, group, description, implementation status
- **Green checkmark** = files exist in the repo (implemented)
- **Circle** = planned/scaffolded

#### Filters
- Click **group buttons** (Foundation, AI Core, Infrastructure, etc.) to filter
- Type in the **search box** to filter by title or description
- **Progress bar** shows overall implementation coverage

#### Clicking a phase card
Each card links directly to the relevant feature section where you can interact with that system.

---

## 4. Terminal

Navigate to **http://localhost:3001/repositories/repo-platform?view=terminal**

### Features
- **Real shell** — runs commands in the project root directory
- **Full output streaming** — stdout and stderr shown color-coded
- **Command history** — press ↑ / ↓ to cycle through past commands
- **Ctrl+L** — clear the terminal
- **Color coding**: green = output, blue = your input, red = errors

### Example Commands to Try
```bash
# See real git history
git log --oneline -10

# Check what's running
docker ps

# List project structure
ls -la

# Run Python tests
python -m pytest tests/ -q --tb=short

# Check Node version
node --version

# See disk usage
du -sh */ 2>/dev/null | sort -h

# View a file
cat docker-compose.yml

# Check git status
git status

# See all branches
git branch -a

# Run the structure check
python scripts/git_auto_commit.py
```

### Security
Commands matching `rm -rf`, `format`, `mkfs`, `shutdown`, `reboot` are blocked. All other commands run as your user in the project root.

---

## 5. Repository Browser & Code Editor

### Repository Browser
Navigate to **http://localhost:3001/repositories/repo-platform**

- Browse the **real project filesystem** (not mock data)
- Click folders to expand them
- Click files to view their content with syntax highlighting
- Supports: `.ts`, `.tsx`, `.py`, `.java`, `.kt`, `.go`, `.yaml`, `.json`, `.md`, and more

### Adding a Repository
1. Go to the **Dashboard** (`/`)
2. Click **+ Add** in the Repositories card
3. Fill in: Name, Description, Provider (GitHub/GitLab/Bitbucket/Local), URL
4. Click **Add Repository** — it appears immediately and persists across refreshes

### Removing a Repository
1. Hover over any repository card on the Dashboard
2. Click the **trash icon** that appears
3. The repository is removed from the workspace

### Code Editor (Phase 11)
Navigate to **http://localhost:3001/repositories/repo-platform?view=editor**

Features:
- **Monaco editor** (same as VS Code)
- AI suggestion panel on the right
- Symbol search, AST viewer, diagnostics panel
- Reference panel for cross-file navigation
- Repository search panel for full-text search

---

## 6. Task Board

Navigate to **http://localhost:3001/repositories/repo-platform?view=tasks**

### Creating a Task
1. Click **+ New Task** button (top right)
2. Fill in:
   - **Title** (required) — press Enter to submit quickly
   - **Priority** — Low / Medium / High / Urgent
   - **Status** — Todo / In Progress / Blocked / Done
   - **Assignee** — leave blank for "Unassigned"
3. Click **Create**

The task immediately appears in the correct column. A notification is auto-generated.

### Moving a Task
1. Hover over any task card
2. Click the **⌄ (chevron)** icon that appears
3. Select the target column (e.g. "→ in progress")

### Deleting a Task
1. Hover over the task card
2. Click the **trash icon**

### Columns
| Column | Meaning |
|--------|---------|
| To do | Not started yet |
| In progress | Actively being worked on |
| Blocked | Waiting on something |
| Done | Completed |

### Persistence
All tasks are saved to **localStorage** and survive page refreshes. The Dashboard shows live counts of open tasks and updates the sidebar badge.

---

## 7. Git Panel

Navigate to **http://localhost:3001/repositories/repo-platform?view=git**

### What You See
- **Branches** — real branches from `git branch -a` in this project
  - Current branch highlighted in green with a dot
- **Recent Commits** — last 30 commits from actual `git log`
  - Each shows: SHA, commit message, author, timestamp

### Actions
- **Copy SHA** — click the 7-character SHA next to any commit to copy the full hash
- **Refresh** — click the ↻ button to re-fetch latest commits and branches

---

## 8. Notifications

Navigate to **http://localhost:3001/repositories/repo-platform?view=notifications**

### Reading Notifications
- Unread notifications have a **bright border** and full opacity
- Read notifications are dimmed (60% opacity)

### Actions
| Action | How |
|--------|-----|
| Mark as read | Hover → click ✓✓ (check-check icon) |
| Dismiss | Hover → click × (X icon) |
| Filter unread | Click "Unread only" toggle |
| Clear all | Click trash icon (top right of panel) |

### Automatic Notifications
These are generated automatically when you:
- Create a task → "Task created"
- Add a repository → "Repository added"

---

## 9. Account Management

### Account Switcher (Top-right header)
Click your **avatar/name** in the top-right corner of the header.

### Switching Accounts
1. Click the account switcher dropdown
2. Click any account in the list — a ✓ appears next to the active one
3. The header updates immediately with the new account's name and email

### Adding an Account
1. Click the account switcher dropdown
2. Click **"+ Add account"**
3. Fill in:
   - **Name** (required)
   - **Email** (required)
   - **Role** — Owner / Admin / Developer / Auditor / Viewer
4. Click **Add Account**

Accounts persist to localStorage and survive page refreshes.

### Roles
| Role | Permissions |
|------|------------|
| Owner | Full access to everything |
| Admin | Manage workspace, users, repos |
| Developer | Create/edit tasks, browse code, use terminal |
| Auditor | Read-only access to all audit logs |
| Viewer | Read-only dashboard access |

---

## 10. AI Core Features

Navigate to **http://localhost:3001/platform/ai**

This section covers **Phases 10–19** of the platform.

### AI Chat Assistant
- **Right-side panel** on the AI Core page
- Type any question about the platform and get an intelligent response
- **Quick prompts** (buttons below chat) for common queries:
  - "Tell me about the Knowledge Graph"
  - "What agents are available?"
  - "Memory system status"
  - "MCP tools list"

#### Example Questions
```
What node types does the knowledge graph have?
How many AI agents are deployed?
What are the memory system tiers?
Which MCP tools are active?
How does code completion work?
```

---

## 11. Knowledge Graph

Section: **http://localhost:3001/platform/ai** → Knowledge Graph panel

### What It Is
A Neo4j graph database connecting every entity in the platform: code, developers, repositories, services, incidents, decisions, requirements, costs, and infrastructure.

### Node Types
| Node | Represents |
|------|-----------|
| `Code` | Functions, classes, modules |
| `Developer` | Team members and agents |
| `Repo` | Repositories |
| `Service` | Microservices |
| `Incident` | Past incidents |
| `Decision` | Architecture decision records |
| `Requirement` | Product requirements |
| `Cost` | Cost centers and resources |
| `Infra` | Infrastructure resources |

### Edge Types (Relationships)
| Edge | Meaning |
|------|---------|
| `CALLS` | Service/function calls another |
| `DEPENDS_ON` | Dependency relationship |
| `AUTHORED_BY` | Code/service authored by developer |
| `DEPLOYED_TO` | Service deployed to infrastructure |
| `RESOLVED_BY` | Incident resolved by agent/developer |
| `DOCUMENTS` | Documentation relationship |

### Importers
The Knowledge Graph has dedicated importers for ingesting data from different sources. View them in the **Importers** section of the panel.

### Python Modules (Backend)
```
knowledge-graph/lattix_knowledge_graph/
├── schema.py          # Node/edge type definitions
├── importer.py        # Data ingestion pipelines
├── query.py           # Query execution engine
├── service.py         # gRPC service interface
└── models.py          # Pydantic data models
```

---

## 12. Memory System

Section: **http://localhost:3001/platform/ai** → Memory System panel

### 5 Memory Tiers

| Tier | Letter | Purpose | Backend |
|------|--------|---------|---------|
| Working | **W** | Current task context (in-flight) | In-process |
| Semantic | **S** | Vector embeddings for similarity search | Qdrant |
| Long-term | **L** | Persistent facts and knowledge | PostgreSQL |
| Procedural | **P** | How-to knowledge and workflows | PostgreSQL |
| Organizational | **O** | Team, org, and process knowledge | Neo4j |

All 5 tiers shown with **live pulse dots** when active.

### Python Modules
```
memory/lattix_memory/
├── working.py         # Working memory context manager
├── semantic.py        # Embedding store interface
├── long_term.py       # Fact persistence
├── procedural.py      # Workflow memory
├── organizational.py  # Org knowledge
└── service.py         # Memory service API
```

---

## 13. Multi-Agent Platform & AI Engineers

Section: **http://localhost:3001/platform/ai** → Multi-Agent Platform panel

### Agent Roles
Each agent role is a specialized AI engineer. View all roles in the panel with:
- Role name and type
- Status badge (available/busy/offline)
- Capabilities list

### Agent Capabilities
Every agent can:
- `code-analysis` — Analyze code for bugs, patterns, quality
- `pr-review` — Automated pull request review
- `automated-fixes` — Apply suggested fixes
- `documentation` — Generate and update documentation

### Platform Architecture (Phase 16)
```
agents/
├── lattix_agents/     # Core agent runtime modules
│   ├── supervisor.py  # Master orchestration agent
│   ├── planner.py     # Task decomposition and planning
│   ├── executor.py    # Task execution engine
│   ├── reflector.py   # Self-evaluation and correction
│   ├── evaluator.py   # Output quality evaluation
│   └── recovery.py    # Failure recovery handler
└── roles/             # Specialized role agents
    ├── code-reviewer/
    ├── ops-engineer/
    ├── security-engineer/
    ├── ml-engineer/
    └── [more roles]/
```

---

## 14. MCP Tool Ecosystem

Section: **http://localhost:3001/platform/ai** → MCP Tool Ecosystem panel

The **Model Context Protocol (MCP)** standardizes how AI agents interact with tools.

### Registered Tools
| Tool Name | Type | Status |
|-----------|------|--------|
| `file-system` | resource | active |
| `git-operations` | resource | active |
| `web-search` | tool | active |
| `code-execution` | tool | sandboxed |
| `database-query` | tool | active |
| `kafka-producer` | tool | active |
| `aws-s3` | resource | active |
| `github-api` | tool | active |

### Tool Types
- **resource** — Exposes data (files, repos, databases) for agents to read
- **tool** — Executes actions (run code, search, send messages)
- **sandboxed** — Runs in isolated environment for safety

---

## 15. Observability

Navigate to **http://localhost:3001/platform/observability**

### Metrics Tab
Real-time platform metrics:
- `http_requests_total` — Total API requests served
- `http_latency_p99` — 99th percentile response time
- `error_rate` — Percentage of errored requests
- `cpu_usage_avg` — Average CPU across all pods
- `memory_rss_gb` — Memory usage
- `kafka_lag_sum` — Consumer group lag
- `db_connections` — Active database connections
- `cache_hit_rate` — Redis cache efficiency

### Logs Tab
Structured log stream from all services:
- Color-coded by level: **INFO** (green), **WARN** (yellow), **ERROR** (red)
- Shows: timestamp, log level, service name, message

### Traces Tab
Distributed trace records showing:
- Operation name and endpoint
- Total duration
- Number of spans
- Status (ok / slow)

### Alerts Tab
Active alert rules:
- Alert name
- Severity (warning/info/critical)
- Time since firing
- Description

### Grafana Dashboards
If running the full stack:
```
http://localhost:3000      # Grafana UI
http://localhost:9090      # Prometheus
http://localhost:16686     # Jaeger UI
```

---

## 16. Digital Twin

Navigate to **http://localhost:3001/platform/digital-twin**

### System Topology Tab
A live, clickable graph of all system nodes:

**Click any node** to see:
- Service name and version
- Current status (healthy/degraded/planned)
- Node type (UI / service / AI / tool / data)
- All dependencies

**Node types:**
- 🔵 UI (Next.js Web)
- 🟣 Services (API Gateway, Auth, Workspace)
- 🟢 AI (Agent Runtime, Knowledge Graph, Memory)
- 🟡 Tools (MCP Server)
- 🔵 Data (PostgreSQL, Redis, Kafka, Neo4j, Qdrant, MinIO)

### Cost Model Tab
Real-time cost breakdown:
- **Current monthly cost** vs **Optimized estimate**
- Per-resource breakdown with savings percentage
- Progress bar showing cost efficiency
- Total potential savings per month

### Incident History Tab
Past incidents with:
- Incident ID and title
- Severity (P1/P2/P3/P4)
- Status (resolved/mitigated)
- Duration
- How it was resolved (AI agent / manual)

---

## 17. Infrastructure & CI/CD

Navigate to **http://localhost:3001/platform/infrastructure**

### CI/CD Pipelines (Phase 25)
Live view of pipeline runs:
- **Pipeline name** and branch
- **Step progress**: lint → test → build → scan → deploy
  - Running step shown with animated pulse
  - Completed steps shown solid
- Duration and last run time
- Status: ✓ success / ⟳ running / ✗ failed

### Cloud Resources (Phase 24)
Multi-cloud resource inventory:
- **AWS** (us-east-1): EKS, RDS, ElastiCache, MSK Kafka, S3
- **GCP** (us-central1): GKE, BigQuery
- Each resource shows type, name, status, monthly cost

### Disaster Recovery (Phase 32)
DR status for each critical component:
| Resource | RTO | RPO |
|----------|-----|-----|
| PostgreSQL backup | < 15min | < 1hr |
| Kafka offsets | < 5min | < 5min |
| S3 replication | < 1min | < 1min |
| Neo4j snapshot | < 30min | < 4hr |

---

## 18. Security & Compliance

Navigate to **http://localhost:3001/platform/security**

### Security Score
Top of the page shows the current security posture score (percentage of passing controls).

### Security Controls (Phase 35)
Four categories of controls:
1. **Zero Trust** — mTLS, RBAC, network policies, workload identity
2. **Secrets Management** — no hardcoded secrets, Vault integration, rotation
3. **Supply Chain** — dependency scans, image signing, SBOM, licenses
4. **Runtime Security** — seccomp, read-only filesystem, non-root, anomaly detection

**Status icons:**
- ✅ Green = Passing
- ⏰ Yellow = Warning (in progress)
- ❌ Red = Failing

### Compliance Frameworks (Phase 36)
| Framework | Controls |
|-----------|----------|
| SOC 2 Type II | 23 controls |
| GDPR | 18 controls |
| ISO 27001 | 31 controls |
| OWASP Top 10 | 10 controls |

Progress bar shows passing vs total for each framework.

### Audit Trail
Live scrollable audit log showing:
- Timestamp
- Actor (user email or agent ID)
- Action type (READ/CREATE/DELETE/EXEC/RATE_LIMIT)
- Resource path
- Result (allowed/blocked/audited)

---

## 19. Data & ML Platform

Navigate to **http://localhost:3001/platform/data**

### Data Engineering Pipelines (Phase 20)
Medallion architecture pipelines:
| Pipeline | Engine | Throughput |
|----------|--------|-----------|
| raw-events → bronze | Kafka → Flink | 12,400 msg/s |
| bronze → silver (enrichment) | Flink SQL | 8,200 rec/s |
| silver → gold (aggregation) | Spark Batch | 2hr window |
| feature-store sync | Airflow DAG | hourly |

### ML Model Registry (Phase 21)
All deployed models with:
- Model name and version
- Framework (PyTorch, scikit-learn, HuggingFace, Prophet)
- Accuracy score
- p50 inference latency
- Status (serving / training)

### Computer Vision (Phase 22)
| Task | Input | Output |
|------|-------|--------|
| Architecture diagram parser | PNG/SVG | Component graph JSON |
| Screenshot → UI code | Screenshot | React/HTML |
| OCR document extraction | PDF/Image | Structured text |
| Whiteboard digitizer | Photo | Diagram + Mermaid |

### Signal Processing (Phase 23)
| Task | Technology |
|------|-----------|
| Meeting transcription | Whisper (40+ languages) |
| Speaker diarization | pyannote.audio |
| Alarm detection | librosa |
| Sentiment analysis | HuggingFace |

---

## 20. Reliability & Chaos Engineering

Navigate to **http://localhost:3001/platform/reliability**

### Chaos Engineering (Phase 34)
View past experiments with real results:
- Pod termination → auto-recovery timing
- Network partition → failover behavior
- CPU throttle → degradation impact
- Kafka broker kill → rebalance timing

**Run a custom experiment:**
1. Type an experiment description in the text box (e.g., "pod-kill auth-service")
2. Click **Simulate** to see the result

### Performance Benchmarks (Phase 37)
| Benchmark | Target | Achieved |
|-----------|--------|---------|
| API Gateway throughput | 10k RPS | 12.4k RPS ✅ |
| Code completion p99 | < 2s | 1.2s ✅ |
| Knowledge graph query p99 | < 100ms | 87ms ✅ |
| Agent dispatch p50 | < 300ms | 284ms ✅ |
| DB write throughput | 5k TPS | 4.8k TPS ⚠️ |
| Memory recall p50 | < 50ms | 43ms ✅ |

### Production Readiness Gates (Phase 40)
8 categories, each showing passed/total:
- Performance, Security, Compliance, Reliability
- Observability, Documentation, DR/RTO/RPO, Cost Targets

Overall score shown as percentage with color-coded progress bar.

---

## 21. Running Tests

### Frontend Tests
```powershell
cd frontend/apps/web
pnpm test
```
Runs 3 test files with Vitest. Expected: **3/3 passing**.

### Python Unit Tests
```powershell
# Activate venv first
.\.venv\Scripts\Activate.ps1

# Run all tests
python -m pytest tests/ -q

# Run specific test suites
python -m pytest tests/test_knowledge_graph.py -v
python -m pytest tests/test_memory_system.py -v
python -m pytest tests/test_multi_agent_platform.py -v
python -m pytest tests/test_mcp_tool_ecosystem.py -v
python -m pytest tests/test_intelligent_chatbot_pipeline.py -v
python -m pytest tests/test_ai_software_engineers.py -v
python -m pytest tests/test_data_engineering_platform.py -v
```

### TypeScript Type Check
```powershell
cd frontend/apps/web
npx tsc --noEmit
```
Expected: **0 errors**.

---

## 22. CLI & SDK

### CLI (Phase 39)
```bash
# The CLI is in the cli/ directory
ls cli/
```

### Python SDK
```python
# sdk/ directory contains public SDK
import lattix_sdk
```

### REST API Endpoints (when services are running)
```
GET  /api/git/log               # Real git commit history
GET  /api/git/branches          # Real branch list
GET  /api/files/tree            # Real filesystem tree
GET  /api/files/read?path=...   # Read a real file
POST /api/terminal              # Execute a shell command
GET  /api/platform/phases       # All 40 phase statuses
GET  /api/platform/agents       # AI agent registry
GET  /api/platform/systems      # Knowledge graph, memory, MCP status
```

---

## 23. Keyboard Shortcuts & Tips

### Terminal
| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate command history |
| `Enter` | Execute command |
| `Ctrl+L` | Clear terminal |

### Browser Navigation
| URL | Page |
|-----|------|
| `http://localhost:3001/` | Dashboard |
| `http://localhost:3001/platform` | All 40 phases |
| `http://localhost:3001/platform/ai` | AI Core |
| `http://localhost:3001/platform/infrastructure` | Infrastructure |
| `http://localhost:3001/platform/observability` | Metrics/Logs/Traces |
| `http://localhost:3001/platform/digital-twin` | System topology |
| `http://localhost:3001/platform/data` | Data & ML |
| `http://localhost:3001/platform/reliability` | Chaos & performance |
| `http://localhost:3001/platform/security` | Security & compliance |
| `http://localhost:3001/repositories/repo-platform?view=terminal` | Real terminal |
| `http://localhost:3001/repositories/repo-platform?view=tasks` | Task board |
| `http://localhost:3001/repositories/repo-platform?view=git` | Git log |
| `http://localhost:3001/repositories/repo-platform?view=notifications` | Notifications |
| `http://localhost:3001/repositories/repo-platform?view=editor` | Code editor |

### Data Persistence
All workspace data (tasks, repos, notifications, accounts) is saved to browser **localStorage** and survives page refreshes. To reset, open DevTools → Application → Local Storage → clear `lattix-workspace`.

---

## Architecture Quick Reference

```
┌──────────────────────────────────────────────────────────┐
│                   Browser (Port 3001)                     │
│  Next.js 15 · React · TypeScript · Zustand · localStorage│
└──────────────────┬───────────────────────────────────────┘
                   │ API Routes (same process)
┌──────────────────▼───────────────────────────────────────┐
│              Next.js API Routes                           │
│  /api/terminal  /api/git/*  /api/files/*  /api/platform/*│
└──────────────────┬───────────────────────────────────────┘
                   │ shell exec / fs reads
┌──────────────────▼───────────────────────────────────────┐
│            Local Filesystem + Git                         │
│    Project root · Real git history · Real source files    │
└──────────────────────────────────────────────────────────┘

[Full Stack — requires Docker]
┌──────────────────────────────────────────────────────────┐
│  PostgreSQL 16 · Redis 7 · Kafka 3.9 · MinIO             │
│  Neo4j · Qdrant · ClickHouse · OpenSearch · MongoDB      │
└──────────────────────────────────────────────────────────┘
```

---

*This guide covers all 40 phases of the Lattix platform. For implementation details, see `docs/implementation-plans/`.*
