"""Evaluation fixtures and regression checks for code completion proposals."""
from __future__ import annotations

import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(_ROOT / "ai-platform" / "code-completion"))
sys.path.insert(0, str(_ROOT / "ai-platform" / "repository-intelligence"))

from lattix_code_completion.models import (
    CompletionRequest,
    CursorLocation,
    CodeProposal,
    PolicyCheckResult,
)
from lattix_code_completion.policies import enforce_generation_policy
from lattix_code_completion.proposals import rank_suggestions


_FIXTURES: list[dict] = [
    {
        "name": "controller-generation",
        "path": "services/workspace-service/src/main/java/com/lattix/workspace/WorkspaceController.java",
        "intent": "generate REST controller class",
        "expected_mode": "proposal",
    },
    {
        "name": "sql-migration",
        "path": "shared/persistence/src/main/resources/db/migration/V4__index.sql",
        "intent": "add index migration",
        "expected_mode": "proposal",
    },
    {
        "name": "kafka-event",
        "path": "shared/events/src/main/java/com/lattix/shared/events/WorkspaceCreatedEvent.java",
        "intent": "create kafka event schema",
        "expected_mode": "proposal",
    },
    {
        "name": "openapi-spec",
        "path": "docs/architecture/api-design.md",
        "intent": "generate openapi schema for repository endpoint",
        "expected_mode": "proposal",
    },
    {
        "name": "inline-completion",
        "path": "frontend/apps/web/src/app/page.tsx",
        "intent": "",
        "expected_mode": "completion",
    },
    {
        "name": "test-generation",
        "path": "tests/test_repository_intelligence.py",
        "intent": "add unit test for search references",
        "expected_mode": "proposal",
    },
    {
        "name": "explanation",
        "path": "ai-platform/repository-intelligence/lattix_ai_repository_intelligence/service.py",
        "intent": "explain ingest_repository_snapshot",
        "expected_mode": "explanation",
    },
    {
        "name": "cache-generation",
        "path": "services/workspace-service/src/main/java/com/lattix/workspace/cache/WorkspaceCache.java",
        "intent": "add redis caching layer",
        "expected_mode": "proposal",
    },
]


def run_evaluation_fixtures() -> list[dict]:
    from lattix_code_completion.planners import plan_generation
    from lattix_code_completion.context import build_completion_context
    from lattix_code_completion.models import CompletionContext

    results = []
    for fixture in _FIXTURES:
        request = CompletionRequest(
            workspace_id="ws-lattix",
            repository_id="repo-platform",
            branch="main",
            commit="eval-fixture",
            path=fixture["path"],
            cursor=CursorLocation(line=1, column=1),
            intent=fixture["intent"] or None,
        )
        context = CompletionContext()
        plan = plan_generation(request, context)
        results.append({
            "name": fixture["name"],
            "expected_mode": fixture["expected_mode"],
            "actual_mode": plan.mode,
            "passed": plan.mode == fixture["expected_mode"],
            "risk_level": plan.risk_level,
            "needs_approval": plan.needs_approval,
        })
    return results
