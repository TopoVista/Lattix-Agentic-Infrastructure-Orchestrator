from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
from uuid import uuid4


@dataclass(slots=True)
class AgentTaskRequest:
    goal: str
    actor: str
    workspace_id: str
    risk_level: str = "low"
    context: dict[str, Any] = field(default_factory=dict)
    required_role: str = "engineer"


@dataclass(slots=True)
class AgentTask:
    id: str
    goal: str
    actor: str
    workspace_id: str
    status: str
    risk_level: str
    context: dict[str, Any] = field(default_factory=dict)
    required_role: str = "engineer"


@dataclass(slots=True)
class TaskGraphNode:
    id: str
    description: str
    agent_type: str
    risk_level: str = "low"


@dataclass(slots=True)
class TaskGraph:
    task_id: str
    nodes: list[TaskGraphNode] = field(default_factory=list)
    edges: list[tuple[str, str]] = field(default_factory=list)
    approvals: list[str] = field(default_factory=list)
    status: str = "planned"


@dataclass(slots=True)
class ScheduledStep:
    id: str
    task_id: str
    agent_type: str
    description: str
    dependencies: list[str]
    risk_level: str
    tool_calls: list["ToolCall"]
    approval_required: bool


@dataclass(slots=True)
class ToolCall:
    id: str
    tool_name: str
    input: dict[str, Any] = field(default_factory=dict)
    output: dict[str, Any] = field(default_factory=dict)
    status: str = "queued"
    risk: str = "low"
    audit_id: str | None = None


@dataclass(slots=True)
class AgentCapability:
    agent_type: str
    tools: list[str] = field(default_factory=list)
    permissions: list[str] = field(default_factory=list)
    input_types: list[str] = field(default_factory=list)
    output_types: list[str] = field(default_factory=list)


@dataclass(slots=True)
class AgentStepResult:
    step_id: str
    task_id: str
    status: str
    evidence: list[str] = field(default_factory=list)
    trace_id: str = field(default_factory=lambda: str(uuid4()))


@dataclass(slots=True)
class ApprovalRequest:
    actor: str
    action: str
    risk: str
    evidence: list[str] = field(default_factory=list)
    expires_at: str | None = None
    required_role: str = "admin"


@dataclass(slots=True)
class ApprovalDecision:
    approved: bool
    reason: str
    action: str | None = None


@dataclass(slots=True)
class EvaluationReport:
    score: float
    findings: list[str] = field(default_factory=list)
    evidence: list[str] = field(default_factory=list)
    retryable: bool = False
    recovery_plan: str | None = None
