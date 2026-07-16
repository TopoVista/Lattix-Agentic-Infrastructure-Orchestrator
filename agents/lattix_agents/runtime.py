from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
from uuid import uuid4

from .models import (
    AgentCapability,
    AgentStepResult,
    AgentTask,
    AgentTaskRequest,
    ApprovalDecision,
    ApprovalRequest,
    EvaluationReport,
    ScheduledStep,
    TaskGraph,
    TaskGraphNode,
    ToolCall,
)


@dataclass(slots=True)
class AgentRuntime:
    capabilities: dict[str, AgentCapability] = field(
        default_factory=lambda: {
            "planner": AgentCapability(agent_type="planner", tools=["decompose"], permissions=["plan"], input_types=["goal"], output_types=["task_graph"]),
            "executor": AgentCapability(agent_type="executor", tools=["execute"], permissions=["run"], input_types=["step"], output_types=["result"]),
            "reviewer": AgentCapability(agent_type="reviewer", tools=["review"], permissions=["review"], input_types=["result"], output_types=["evaluation"]),
        }
    )

    def create_agent_task(self, request: AgentTaskRequest) -> AgentTask:
        return AgentTask(
            id=str(uuid4()),
            goal=request.goal,
            actor=request.actor,
            workspace_id=request.workspace_id,
            status="created",
            risk_level=request.risk_level,
            context=request.context,
            required_role=request.required_role,
        )

    def plan_task_graph(self, task: AgentTask) -> TaskGraph:
        nodes = [
            TaskGraphNode(id="plan", description=task.goal, agent_type="planner", risk_level=task.risk_level),
            TaskGraphNode(id="execute", description="Execute plan", agent_type="executor", risk_level=task.risk_level),
            TaskGraphNode(id="review", description="Review outcome", agent_type="reviewer", risk_level="low"),
        ]
        return TaskGraph(task_id=task.id, nodes=nodes, edges=[("plan", "execute"), ("execute", "review")], approvals=["approval-required" if task.risk_level == "high" else "none"])

    def schedule_next_step(self, task_graph: TaskGraph) -> ScheduledStep | None:
        if not task_graph.nodes:
            return None

        first = task_graph.nodes[0]
        return ScheduledStep(
            id=f"{task_graph.task_id}:{first.id}",
            task_id=task_graph.task_id,
            agent_type=first.agent_type,
            description=first.description,
            dependencies=[],
            risk_level=first.risk_level,
            tool_calls=[ToolCall(id=str(uuid4()), tool_name="decompose", input={"goal": first.description})],
            approval_required=first.risk_level == "high",
        )

    def execute_agent_step(self, step: ScheduledStep) -> AgentStepResult:
        evidence = [f"executed {step.agent_type} for {step.description}"]
        if step.approval_required:
            evidence.append("approval pending")
        return AgentStepResult(step_id=step.id, task_id=step.task_id, status="completed", evidence=evidence)

    def request_human_approval(self, request: ApprovalRequest) -> ApprovalDecision:
        if request.risk.lower() == "high" or request.required_role == "admin":
            return ApprovalDecision(approved=False, reason="approval required", action=request.action)
        return ApprovalDecision(approved=True, reason="auto-approved", action=request.action)

    def evaluate_agent_result(self, result: AgentStepResult) -> EvaluationReport:
        score = 0.9 if result.status == "completed" else 0.3
        return EvaluationReport(score=score, findings=["step completed"], evidence=result.evidence, retryable=False, recovery_plan=None)
