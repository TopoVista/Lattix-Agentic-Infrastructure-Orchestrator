from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class ChatMessage:
    conversation_id: str
    actor: str
    workspace_id: str
    content: str
    attachments: list[str] = field(default_factory=list)
    timestamp: str = ""


@dataclass(slots=True)
class IntentResult:
    intent: str
    risk: str
    required_sources: list[str] = field(default_factory=list)
    action_candidate: bool = False
    confidence: float = 0.0


@dataclass(slots=True)
class RetrievalPlan:
    steps: list[str] = field(default_factory=list)
    sources: list[str] = field(default_factory=list)
    budgets: dict[str, int] = field(default_factory=dict)
    required_evidence: list[str] = field(default_factory=list)
    tool_candidates: list[str] = field(default_factory=list)


@dataclass(slots=True)
class ContextBundle:
    evidence_items: list[dict[str, Any]] = field(default_factory=list)
    sources: list[str] = field(default_factory=list)
    denied_items: list[str] = field(default_factory=list)
    freshness: str = "fresh"
    token_usage: int = 0


@dataclass(slots=True)
class DraftAnswer:
    content: str
    citations: list[str] = field(default_factory=list)
    action_proposal: str | None = None
    assumptions: list[str] = field(default_factory=list)
    limitations: list[str] = field(default_factory=list)


@dataclass(slots=True)
class VerificationReport:
    supported_claims: list[str] = field(default_factory=list)
    unsupported_claims: list[str] = field(default_factory=list)
    conflicts: list[str] = field(default_factory=list)
    risk_findings: list[str] = field(default_factory=list)


@dataclass(slots=True)
class ConfidenceScore:
    score: float
    reasons: list[str] = field(default_factory=list)
