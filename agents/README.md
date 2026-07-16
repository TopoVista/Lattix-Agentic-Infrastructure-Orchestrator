# Multi-Agent Platform & AI Engineers — Developer Guide

> Supervisor, planner, executor, reflector, evaluator, recovery agents + specialized AI engineer roles.

## Overview (Phases 16, 19)

The Multi-Agent Platform orchestrates specialized AI agents to perform engineering tasks autonomously with human approval gates for high-risk operations.

## Agent Architecture

```
Supervisor Agent
    ├── Planner Agent        → Decomposes tasks into subtasks
    ├── Scheduler Agent      → Assigns subtasks to role agents
    │
    ├── Role Agents (Phase 19)
    │   ├── Code Reviewer    → PR analysis, quality checks
    │   ├── Ops Engineer     → Infrastructure, deployments, incidents
    │   ├── Security Engineer → Security scans, threat analysis
    │   ├── ML Engineer      → Model training, evaluation, serving
    │   ├── Incident Agent   → Alert triage, runbook execution
    │   └── [more roles]
    │
    ├── Reflector Agent      → Self-evaluation of outputs
    ├── Evaluator Agent      → Quality scoring
    └── Recovery Agent       → Failure handling, retry logic
```

## Python Usage

### Dispatching a Task

```python
from lattix_agents import AgentRuntime

runtime = AgentRuntime()

# Dispatch a code review task
result = runtime.dispatch(
    task_type="code-review",
    payload={
        "pr_url": "https://github.com/org/repo/pull/441",
        "files_changed": ["src/lib/store.ts", "src/components/dashboard.tsx"],
        "description": "Add task CRUD to workspace store"
    },
    role="code-reviewer",
    require_approval=False   # Set True for destructive operations
)

print(f"Review: {result.summary}")
print(f"Issues found: {len(result.issues)}")
print(f"Approved: {result.approved}")
```

### Running an Ops Agent

```python
runtime = AgentRuntime()

# Ask ops agent to investigate an alert
investigation = runtime.dispatch(
    task_type="incident-investigate",
    payload={
        "alert_name": "KafkaConsumerLagHigh",
        "service": "kafka",
        "threshold": 100,
        "current_value": 124
    },
    role="ops-engineer"
)

print(f"Root cause: {investigation.root_cause}")
print(f"Recommended action: {investigation.recommendation}")
print(f"Auto-fix available: {investigation.has_fix}")
```

### Supervisor Workflow

```python
from lattix_agents import Supervisor

supervisor = Supervisor()

# Run a full engineering workflow
workflow = supervisor.run_workflow(
    goal="Review and merge PR #441, then deploy to staging",
    steps=[
        {"agent": "code-reviewer", "task": "review-pr"},
        {"agent": "ops-engineer", "task": "deploy-staging"},
        {"agent": "ops-engineer", "task": "smoke-test"},
    ],
    require_human_approval_before=["deploy-staging"]
)
```

## Agent Capabilities Matrix

| Agent | Code Analysis | PR Review | Deployment | Security Scan | Incident |
|-------|:---:|:---:|:---:|:---:|:---:|
| Code Reviewer | ✅ | ✅ | ❌ | ⚠️ | ❌ |
| Ops Engineer | ⚠️ | ❌ | ✅ | ⚠️ | ✅ |
| Security Engineer | ✅ | ✅ | ❌ | ✅ | ✅ |
| ML Engineer | ✅ | ✅ | ✅ | ❌ | ❌ |
| Incident Agent | ✅ | ❌ | ⚠️ | ✅ | ✅ |

✅ Full support · ⚠️ Partial · ❌ Not supported

## Human Approval Gates

Certain operations always require human approval:
- Production deployments
- Secret access or rotation
- Cross-tenant data operations
- Destructive infrastructure changes (delete, scale-to-zero)

```python
result = runtime.dispatch(
    task_type="deploy-production",
    payload={...},
    role="ops-engineer",
    require_approval=True  # Will pause and notify human
)
# Execution pauses here until human approves via UI or API
```

## Running Tests

```bash
python -m pytest tests/test_multi_agent_platform.py -v
python -m pytest tests/test_ai_software_engineers.py -v
```
