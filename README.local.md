# Lattix — Running Locally (Complete Guide)

> Step-by-step instructions to get every part of the Lattix platform running on your machine.

---

## Prerequisites

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Node.js | 20.x | `node --version` |
| pnpm | 9.x | `pnpm --version` |
| Python | 3.12 | `python --version` |
| Git | 2.40 | `git --version` |
| Docker Desktop | 4.x | `docker --version` |

---

## Option A — Web UI Only (No Docker Required)

The fastest way to explore all 40 phases in the browser.

```powershell
# From the repo root
pnpm install --no-frozen-lockfile

cd frontend/apps/web
pnpm dev
```

Open **http://localhost:3000** (or 3001 if busy).

**What works:**
- All Platform Portal pages (Phases 1–40 feature explorer)
- Dashboard, Task Board, Notifications, Account Switcher
- Real terminal (runs actual shell commands)
- Real git log and branches
- Real filesystem browser
- Code editor (Monaco)

---

## Option B — With Core Infrastructure (Docker)

Adds PostgreSQL, Redis, Kafka, and MinIO for full data persistence.

```powershell
# Start core services
docker compose --profile core up -d

# Verify all services are healthy
docker compose ps

# Then start the web UI (same as Option A)
cd frontend/apps/web
pnpm dev
```

**Services started:**
| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL 16 | 5432 | Primary database |
| Redis 7 | 6379 | Cache + sessions |
| Kafka 3.9 | 9092 | Event streaming |
| MinIO | 9000 | Object storage |
| MinIO Console | 9001 | MinIO UI (minioadmin/minioadmin) |

---

## Option C — Python AI Services

Run the Python test suite and AI service scaffolds.

```powershell
# Activate virtual environment
.\.venv\Scripts\Activate.ps1   # Windows PowerShell

# Or on Bash/Git Bash:
source .venv/Scripts/activate

# Install/upgrade pip
python -m pip install --upgrade pip pytest

# Verify
python --version       # Should show 3.12.x
python -m pytest --version
```

### Run All Python Tests

```powershell
python -m pytest tests/ -q --tb=short
```

### Run Specific Test Suites

```powershell
# Knowledge Graph (Phase 14)
python -m pytest tests/test_knowledge_graph.py -v

# Memory System (Phase 15)
python -m pytest tests/test_memory_system.py -v

# Multi-Agent Platform (Phase 16)
python -m pytest tests/test_multi_agent_platform.py -v

# MCP Tool Ecosystem (Phase 17)
python -m pytest tests/test_mcp_tool_ecosystem.py -v

# Intelligent Chatbot Pipeline (Phase 18)
python -m pytest tests/test_intelligent_chatbot_pipeline.py -v

# AI Software Engineers (Phase 19)
python -m pytest tests/test_ai_software_engineers.py -v

# Data Engineering Platform (Phase 20)
python -m pytest tests/test_data_engineering_platform.py -v
```

---

## Option D — Full Stack (All Services)

```powershell
# Start ALL Docker services (core + AI + observability)
docker compose --profile core --profile observability up -d

# Check health
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

**Additional services:**
| Service | Port | Purpose |
|---------|------|---------|
| Prometheus | 9090 | Metrics scraping |
| Grafana | 3000 | Dashboards (admin/admin) |
| Jaeger | 16686 | Distributed tracing |
| AlertManager | 9093 | Alert routing |

---

## Service URLs (Full Stack)

| Service | URL | Credentials |
|---------|-----|------------|
| **Lattix Web UI** | http://localhost:3001 | N/A (localStorage auth) |
| Grafana | http://localhost:3000 | admin / admin |
| Prometheus | http://localhost:9090 | N/A |
| Jaeger | http://localhost:16686 | N/A |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |
| pgAdmin (if added) | http://localhost:5050 | N/A |

---

## Stopping Everything

```powershell
# Stop web UI: Ctrl+C in the terminal running pnpm dev

# Stop Docker services
docker compose down

# Stop + remove volumes (WARNING: deletes all data)
docker compose down -v
```

---

## Troubleshooting

### Port 3000 already in use
Next.js auto-picks the next free port (3001, 3002, etc.). Check the console output for the actual URL.

### Docker: "cannot find pipe/dockerDesktopLinuxEngine"
Docker Desktop is not running. Start Docker Desktop and wait for it to show "Engine running" before running `docker compose`.

### Python: Module not found
Make sure the virtual environment is activated:
```powershell
.\.venv\Scripts\Activate.ps1
```

### pnpm: "Lockfile is up to date" but still errors
```powershell
pnpm install --no-frozen-lockfile
```

### TypeScript errors
```powershell
cd frontend/apps/web
npx tsc --noEmit
# Should show 0 errors
```

### Git auto-commit script fails
```powershell
python scripts/git_auto_commit.py
# If it fails, make sure git is configured:
git config user.email "owner@lattix.io"
git config user.name "Lattix Owner"
```

---

## Development Workflow

1. Start infrastructure: `docker compose --profile core up -d`
2. Start web UI: `cd frontend/apps/web && pnpm dev`
3. Open http://localhost:3001
4. Make code changes — Next.js hot-reloads automatically
5. Run tests: `pnpm test` (frontend) or `python -m pytest` (Python)
6. Commit: `git add . && git commit -m "feat: your change"`
