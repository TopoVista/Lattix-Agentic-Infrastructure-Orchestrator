from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


class DataclassAccessMixin:
    def __getitem__(self, item: str) -> Any:
        return getattr(self, item)


@dataclass(slots=True)
class CloudResourceRef(DataclassAccessMixin):
    type: str
    id: str
    name: str | None = None
    tags: dict[str, str] = field(default_factory=dict)
    data_class: str = "internal"
    cost_center: str | None = None
    owner: str | None = None


@dataclass(slots=True)
class CloudResourceState(DataclassAccessMixin):
    provider: str
    type: str
    id: str
    region: str
    tags: dict[str, str]
    status: str
    configuration: dict[str, Any]
    last_seen_at: str

    @property
    def lastSeenAt(self) -> str:
        return self.last_seen_at


@dataclass(slots=True)
class CloudActionRequest(DataclassAccessMixin):
    actor: str
    workspace_id: str
    provider: str
    account: str
    region: str
    environment: str
    resource: CloudResourceRef
    action: str
    parameters: dict[str, Any] = field(default_factory=dict)
    role: str = "developer"
    reason: str = ""
    approvals: list[str] = field(default_factory=list)
    dry_run: bool = True
    trace_id: str | None = None

    @property
    def workspaceId(self) -> str:
        return self.workspace_id


@dataclass(slots=True)
class CloudPolicyFinding(DataclassAccessMixin):
    rule: str
    severity: str
    message: str
    requires_approval: bool = False


@dataclass(slots=True)
class CloudActionValidation(DataclassAccessMixin):
    request_id: str
    allowed: bool
    risk_level: str
    requires_approval: bool
    requires_dry_run: bool
    destructive: bool
    cost_impact: float
    findings: list[CloudPolicyFinding] = field(default_factory=list)
    required_approvals: list[str] = field(default_factory=list)
    reasons: list[str] = field(default_factory=list)


@dataclass(slots=True)
class CloudActionPlan(DataclassAccessMixin):
    id: str
    request: CloudActionRequest
    validation: CloudActionValidation
    proposed_changes: list[dict[str, Any]]
    blast_radius: dict[str, Any]
    rollback_plan: dict[str, Any]
    approvals: list[str]
    provider: str
    status: str
    created_at: str
    dry_run: bool = True

    @property
    def proposedChanges(self) -> list[dict[str, Any]]:
        return self.proposed_changes

    @property
    def blastRadius(self) -> dict[str, Any]:
        return self.blast_radius

    @property
    def rollbackPlan(self) -> dict[str, Any]:
        return self.rollback_plan


@dataclass(slots=True)
class CloudAuditEvent(DataclassAccessMixin):
    id: str
    actor: str
    action: str
    provider: str
    resource_id: str
    environment: str
    status: str
    trace_id: str
    created_at: str
    details: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class CloudActionResult(DataclassAccessMixin):
    plan_id: str
    status: str
    provider_result: dict[str, Any]
    observed_state: CloudResourceState | None
    audit_id: str
    events: list[CloudAuditEvent] = field(default_factory=list)

    @property
    def planId(self) -> str:
        return self.plan_id

    @property
    def providerResult(self) -> dict[str, Any]:
        return self.provider_result

    @property
    def observedState(self) -> CloudResourceState | None:
        return self.observed_state

    @property
    def auditId(self) -> str:
        return self.audit_id


@dataclass(slots=True)
class ReconciliationRequest(DataclassAccessMixin):
    desired: CloudResourceState
    actual: CloudResourceState | None
    workspace_id: str
    provider: str
    environment: str
    repair_allowed: bool = False


@dataclass(slots=True)
class ReconciliationReport(DataclassAccessMixin):
    desired: CloudResourceState
    actual: CloudResourceState | None
    drift: list[dict[str, Any]]
    risk: str
    recommended_actions: list[CloudActionRequest]
    events: list[CloudAuditEvent] = field(default_factory=list)

    @property
    def recommendedActions(self) -> list[CloudActionRequest]:
        return self.recommended_actions


@dataclass(slots=True)
class RepairRequest(DataclassAccessMixin):
    resource: CloudResourceState
    strategy: str
    actor: str
    workspace_id: str
    environment: str
    approvals: list[str] = field(default_factory=list)
    parameters: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class RepairResult(DataclassAccessMixin):
    resource_id: str
    strategy: str
    status: str
    actions: list[CloudActionResult]
    audit_id: str


@dataclass(slots=True)
class ProviderCapabilities(DataclassAccessMixin):
    provider: str
    supported_actions: list[str]
    resource_types: list[str]
    dry_run_actions: list[str]
    status: str = "available"


@dataclass(slots=True)
class ControllerEvent(DataclassAccessMixin):
    type: str
    subject: str
    payload: dict[str, Any]
    created_at: str
