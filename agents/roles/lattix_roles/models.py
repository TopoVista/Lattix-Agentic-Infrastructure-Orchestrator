from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class AgentRoleManifest:
    name: str
    capabilities: list[str]
    tools: list[str]
    context_sources: list[str]
    prompts: list[str]
    output_schemas: list[str]
    policies: dict[str, Any]


@dataclass(slots=True)
class AgentRole:
    manifest: AgentRoleManifest

    @property
    def name(self) -> str:
        return self.manifest.name


@dataclass(slots=True)
class RoleRoutingRequest:
    task_intent: str
    context: dict[str, Any]
    risk: str = "low"
    permissions: list[str] | None = None


@dataclass(slots=True)
class RoleRoutingDecision:
    selected_roles: list[AgentRole]
    rationale: list[str] = field(default_factory=list)
    required_approvals: list[str] = field(default_factory=list)
    expected_outputs: list[str] = field(default_factory=list)


@dataclass(slots=True)
class RoleAgentRunRequest:
    role_name: str
    task: str
    context: dict[str, Any]
    evidence: list[str] | None = None


@dataclass(slots=True)
class RoleAgentResult:
    role: str
    output: dict[str, Any]
    evidence: list[str] = field(default_factory=list)
    tool_calls: list[str] = field(default_factory=list)
    policy_findings: list[str] = field(default_factory=list)
    confidence: float = 0.0


@dataclass(slots=True)
class CollaborationRequest:
    participants: list[str]
    task: str
    context: dict[str, Any]


@dataclass(slots=True)
class CollaborationResult:
    participants: list[str]
    intermediate_results: list[dict[str, Any]] = field(default_factory=list)
    final_output: dict[str, Any] = field(default_factory=dict)
    disagreements: list[str] = field(default_factory=list)
    review: str = ""


@dataclass(slots=True)
class RoleEvaluation:
    score: float
    rubric_findings: list[str] = field(default_factory=list)
    failures: list[str] = field(default_factory=list)
    improvement_suggestions: list[str] = field(default_factory=list)
