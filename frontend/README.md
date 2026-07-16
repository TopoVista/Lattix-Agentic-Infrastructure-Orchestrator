# Lattix Frontend — Developer Guide

> Next.js 15 web application for the Lattix platform.

## Quick Start

```powershell
# From project root
pnpm install --no-frozen-lockfile
cd frontend/apps/web
pnpm dev
# → http://localhost:3000 (or 3001 if port busy)
```

## Routes

### Workspace Routes
| Route | Description |
|-------|-------------|
| `/` | Dashboard — live repo/task/notification counts |
| `/repositories/[id]` | Repository browser (real filesystem) |
| `/repositories/[id]?view=editor` | Monaco code editor + AI suggestions |
| `/repositories/[id]?view=git` | Real git log + branch list |
| `/repositories/[id]?view=terminal` | **Live shell** — runs real commands |
| `/repositories/[id]?view=tasks` | Kanban task board (CRUD) |
| `/repositories/[id]?view=notifications` | Dismissable notifications |
| `/repositories/[id]?view=docs` | Documentation links |

### Platform Portal Routes (All 40 Phases)
| Route | Phases | Description |
|-------|--------|-------------|
| `/platform` | 0–40 | Phase overview grid with implementation status |
| `/platform/ai` | 10–19 | Knowledge Graph, Memory, Agents, MCP, Chat, AI Engineers |
| `/platform/infrastructure` | 3–7, 24–25, 32–33 | CI/CD, Cloud, DR |
| `/platform/observability` | 26 | Metrics, Logs, Traces, Alerts |
| `/platform/digital-twin` | 27, 38 | System topology, Cost model, Incidents |
| `/platform/data` | 8, 20–23 | Data pipelines, ML registry, Vision, Signal |
| `/platform/reliability` | 28–34, 37, 40 | Chaos, Perf benchmarks, Prod readiness |
| `/platform/security` | 7, 35–36 | Security controls, Compliance, Audit trail |
| `/platform/enterprise` | 37–40 | Cost optimization, Launch gates |

## API Routes (Next.js Backend)

All API routes run server-side via `next dev` — no separate backend needed.

### Core Workspace APIs
```
POST /api/terminal              Run a shell command in project root
GET  /api/git/log               Real git log (last 30 commits)
GET  /api/git/branches          Real branch list
GET  /api/files/tree?path=...   Real filesystem tree
GET  /api/files/read?path=...   Read a real file
```

### Platform Portal APIs
```
GET  /api/platform/phases       All 40 phases with implementation status
GET  /api/platform/agents       AI agent registry (from filesystem)
GET  /api/platform/systems      KG, Memory, MCP, Digital Twin, Observability
```

## State Management

Uses **Zustand** with **localStorage persistence** (`lattix-workspace` key).

### Store Shape (`src/lib/store.ts`)
```typescript
{
  tasks: WorkspaceTask[]          // Kanban tasks
  repos: RepositorySummary[]      // Connected repositories
  notifications: NotificationItem[] // Platform notifications
  accounts: Account[]             // User accounts
  currentAccountId: string        // Active account
  terminalHistory: Line[]         // Terminal session history
  selectedRepositoryId: string    // Active repo
  selectedFilePath: string        // Active file
}
```

### Actions Available
```typescript
addTask(...)              // Create a task
updateTaskStatus(id, s)   // Move to column
deleteTask(id)            // Remove task
addRepo(...)              // Connect repository
deleteRepo(id)            // Remove repository
markNotificationRead(id)  // Mark as read
dismissNotification(id)   // Remove notification
addNotification(...)      // Add new alert
addAccount(...)           // Add user profile
switchAccount(id)         // Switch active user
pushTerminalLine(line)    // Add terminal output
clearTerminalHistory()    // Clear terminal
```

## Component Structure

```
src/components/
├── workspace/                  Workspace UI
│   ├── workspace-shell.tsx     App shell + sidebar + account switcher
│   ├── dashboard.tsx           Dashboard with live data from store
│   ├── task-board.tsx          Kanban board (full CRUD)
│   ├── terminal-panel.tsx      Real interactive terminal
│   ├── git-panel.tsx           Real git log from API
│   ├── notifications-panel.tsx Dismissable notifications
│   ├── repository-browser.tsx  File tree + content viewer
│   ├── repository-detail.tsx   Tab router for workspace views
│   ├── account-switcher.tsx    Multi-account dropdown
│   └── docs-panel.tsx          Documentation links
│
├── platform/                   Platform Portal (Phase 1-40)
│   ├── platform-shell.tsx      Tab navigation for platform sections
│   ├── phase-overview.tsx      All 40 phases grid
│   ├── ai-core-panel.tsx       KG + Memory + Agents + MCP + AI Chat
│   ├── observability-panel.tsx Metrics/Logs/Traces/Alerts tabs
│   ├── digital-twin-panel.tsx  Topology + Cost + Incidents
│   ├── infrastructure-panel.tsx CI/CD + Cloud + DR
│   ├── data-ml-panel.tsx       Pipelines + ML Registry + CV + Signal
│   ├── reliability-panel.tsx   Chaos + Perf + Readiness
│   └── security-panel.tsx      Controls + Compliance + Audit
│
├── editor/                     Code editor (Phase 11)
│   ├── editor-workspace.tsx    Full editor layout
│   ├── code-editor.tsx         Monaco editor wrapper
│   ├── ai-suggestions.tsx      AI code suggestions
│   ├── ast-viewer.tsx          Parse tree viewer
│   ├── diagnostics-panel.tsx   Error/warning panel
│   └── symbol-search.tsx       Symbol navigation
│
└── ui/                         Design system
    ├── card.tsx                Card components
    ├── badge.tsx               Status badges
    └── [more primitives]
```

## Development Commands

```powershell
pnpm dev          # Start dev server (port 3000 or 3001)
pnpm build        # Production build
pnpm test         # Run Vitest test suite
pnpm lint         # ESLint check
npx tsc --noEmit  # Type check only
```

## Environment Variables

Create `frontend/apps/web/.env.local`:
```env
# Optional: connect to real Java backend
NEXT_PUBLIC_LATTIX_API_BASE_URL=http://localhost:8080

# Without this set, Next.js API routes handle all data
```
