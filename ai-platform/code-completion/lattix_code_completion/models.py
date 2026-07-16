from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal


@dataclass(slots=True)
class CursorLocation:
    line: int
    column: int

    def __getitem__(self, item):
        return getattr(self, item)


@dataclass(slots=True)
class SelectionRange:
    start_line: int
    start_column: int
    end_line: int
    end_column: int

    def __getitem__(self, item):
        return getattr(self, item)


@dataclass(slots=True)
class CompletionRequest:
    workspace_id: str
    repository_id: str
    branch: str
    commit: str
    path: str
    cursor: CursorLocation
    selection: SelectionRange | None = None
    intent: str | None = None

    def __getitem__(self, item):
        return getattr(self, item)


@dataclass(slots=True)
class CompletionContext:
    files: list[dict[str, str]] = field(default_factory=list)
    symbols: list[dict] = field(default_factory=list)
    graph_neighbors: list[dict] = field(default_factory=list)
    api_contracts: list[dict] = field(default_factory=list)
    schemas: list[dict] = field(default_factory=list)
    tests: list[str] = field(default_factory=list)
    style_examples: list[str] = field(default_factory=list)

    def __getitem__(self, item):
        return getattr(self, item)


@dataclass(slots=True)
class GenerationPlan:
    mode: Literal["completion", "explanation", "refactor", "proposal"]
    steps: list[str] = field(default_factory=list)
    required_context: list[str] = field(default_factory=list)
    risk_level: Literal["low", "medium", "high"] = "low"
    needs_approval: bool = False
    request: CompletionRequest | None = None
    context: CompletionContext | None = None

    def __getitem__(self, item):
        return getattr(self, item)



@dataclass(slots=True)
class PolicyCheckResult:
    allowed: bool
    violations: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    required_approval: bool = False

    def __getitem__(self, item):
        return getattr(self, item)


@dataclass(slots=True)
class CodeProposal:
    files: list[dict[str, str]] = field(default_factory=list)
    hunks: list[dict[str, str]] = field(default_factory=list)
    explanation: str = ""
    evidence: list[str] = field(default_factory=list)
    confidence: float = 1.0
    tests: list[str] = field(default_factory=list)
    policy_result: PolicyCheckResult | None = None

    def __getitem__(self, item):
        return getattr(self, item)
