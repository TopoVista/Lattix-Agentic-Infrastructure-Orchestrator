# Memory System — Developer Guide

> 5-tier memory architecture for AI agents: working, semantic, long-term, procedural, and organizational.

## Overview (Phase 15)

The Memory System gives AI agents persistent, queryable context across sessions, tasks, and organizational boundaries.

## Memory Tiers

### 1. Working Memory (W)
**In-process, ephemeral, per-task context**

```python
from lattix_memory import WorkingMemory

wm = WorkingMemory(task_id="task-441")

# Store current task context
wm.set("current_file", "src/lib/store.ts")
wm.set("cursor_line", 42)
wm.set("user_intent", "add new task action")

# Retrieve context
file = wm.get("current_file")  # "src/lib/store.ts"

# Clear when task completes
wm.clear()
```

### 2. Semantic Memory (S)
**Vector embeddings for similarity search (Qdrant backend)**

```python
from lattix_memory import SemanticMemory

sm = SemanticMemory()

# Store a fact with embedding
sm.store(
    content="The WorkspaceShell component wraps all workspace pages and provides navigation.",
    metadata={"source": "code", "file": "workspace-shell.tsx"}
)

# Search by semantic similarity
results = sm.search(
    query="How does the main layout work?",
    top_k=5
)
for r in results:
    print(f"Score: {r.score:.3f} | {r.content[:80]}")
```

### 3. Long-term Memory (L)
**Persistent facts and knowledge (PostgreSQL backend)**

```python
from lattix_memory import LongTermMemory

ltm = LongTermMemory()

# Store a persistent fact
ltm.remember(
    fact="The auth service uses JWT with 1-hour expiry and RS256 signing",
    category="security",
    confidence=0.95
)

# Recall facts
auth_facts = ltm.recall(category="security", query="token expiry")
```

### 4. Procedural Memory (P)
**How-to knowledge and reusable workflows**

```python
from lattix_memory import ProceduralMemory

pm = ProceduralMemory()

# Store a procedure
pm.store_procedure(
    name="deploy-to-production",
    steps=[
        "Run test suite",
        "Build Docker image",
        "Push to registry",
        "Update Helm values",
        "ArgoCD sync",
        "Smoke test"
    ],
    success_count=47
)

# Retrieve the best procedure for a goal
procedure = pm.get_procedure(goal="deploy service to production")
```

### 5. Organizational Memory (O)
**Team, org, and process knowledge (Neo4j backend)**

```python
from lattix_memory import OrganizationalMemory

om = OrganizationalMemory()

# Store org knowledge
om.store(
    type="team-convention",
    content="All PRs require 2 approvals from senior engineers",
    team="platform",
    source="CONTRIBUTING.md"
)

# Query org knowledge
conventions = om.query(topic="code review", team="platform")
```

## Unified Memory Interface

```python
from lattix_memory import MemoryService

memory = MemoryService()

# Write to all relevant tiers
memory.remember(
    content="User fixed the Kafka consumer lag by increasing partition count",
    tiers=["semantic", "long_term"],
    metadata={"incident_id": "INC-001", "agent": "ops-engineer"}
)

# Unified recall across all tiers
context = memory.recall(
    query="How was the last Kafka incident resolved?",
    tiers=["semantic", "long_term", "procedural"]
)
```

## Running Tests

```bash
python -m pytest tests/test_memory_system.py -v
```
