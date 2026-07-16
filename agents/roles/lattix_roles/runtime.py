from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .models import (
    AgentRole,
    AgentRoleManifest,
    CollaborationRequest,
    CollaborationResult,
    RoleAgentResult,
    RoleAgentRunRequest,
    RoleEvaluation,
    RoleRoutingDecision,
    RoleRoutingRequest,
)


@dataclass(slots=True)
class RoleRuntime:
    roles: dict[str, AgentRole] = field(default_factory=dict)

    def register_agent_role(self, manifest: AgentRoleManifest) -> AgentRole:
        role = AgentRole(manifest=manifest)
        self.roles[manifest.name] = role
        return role

    def route_to_role(self, request: RoleRoutingRequest) -> RoleRoutingDecision:
        selected = [role for role in self.roles.values() if request.task_intent in {"debug", "inspect", "plan"} and "backend" in role.manifest.name]
        if not selected:
            selected = [role for role in self.roles.values() if role.manifest.name in {"backend", "security", "architect", "testing"}]
        approvals = ["approval-required"] if request.risk == "high" else []
        return RoleRoutingDecision(
            selected_roles=selected,
            rationale=[f"matched task intent {request.task_intent}"],
            required_approvals=approvals,
            expected_outputs=["plan", "review"],
        )

    def run_role_agent(self, request: RoleAgentRunRequest) -> RoleAgentResult:
        role = self.roles.get(request.role_name)
        if role is None:
            raise KeyError(f"unknown role: {request.role_name}")
        policy_findings = []
        if role.manifest.policies.get("approval_required") and role.manifest.policies.get("approval_risk") == "high":
            policy_findings.append("requires approval")
        return RoleAgentResult(
            role=request.role_name,
            output={"status": "completed", "task": request.task, "context": request.context},
            evidence=request.evidence or ["no evidence provided"],
            tool_calls=role.manifest.tools,
            policy_findings=policy_findings,
            confidence=0.85,
        )

    def coordinate_role_agents(self, request: CollaborationRequest) -> CollaborationResult:
        results = []
        for participant in request.participants:
            result = self.run_role_agent(RoleAgentRunRequest(role_name=participant, task=request.task, context=request.context))
            results.append(result.output)
        return CollaborationResult(
            participants=request.participants,
            intermediate_results=results,
            final_output={"status": "completed", "participants": request.participants, "task": request.task},
            disagreements=[],
            review="collaboration completed",
        )

    def evaluate_role_output(self, result: RoleAgentResult) -> RoleEvaluation:
        failures = []
        if not result.evidence:
            failures.append("missing evidence")
        return RoleEvaluation(
            score=0.9 if not failures else 0.4,
            rubric_findings=["evidence-backed"],
            failures=failures,
            improvement_suggestions=["add more evidence"],
        )
