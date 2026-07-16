from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
from uuid import uuid4

from .models import (
    CloudActionPlan,
    CloudActionRequest,
    CloudActionResult,
    CloudActionValidation,
    CloudAuditEvent,
    CloudResourceRef,
    CloudResourceState,
    ControllerEvent,
    ProviderCapabilities,
    ReconciliationReport,
    ReconciliationRequest,
    RepairRequest,
    RepairResult,
)
from .policies import validate_policy
from .providers import CloudProviderAdapter, default_provider_adapters
from .runtime import deep_diff, now_iso, stable_id


@dataclass(slots=True)
class CloudControllerService:
    adapters: dict[str, CloudProviderAdapter] = field(default_factory=default_provider_adapters)
    plans: dict[str, CloudActionPlan] = field(default_factory=dict)
    results: dict[str, CloudActionResult] = field(default_factory=dict)
    audit_events: list[CloudAuditEvent] = field(default_factory=list)
    lifecycle_events: list[ControllerEvent] = field(default_factory=list)

    def validate_cloud_action(self, request: CloudActionRequest) -> CloudActionValidation:
        self._adapter(request.provider)
        validation = validate_policy(request)
        self._publish(
            "cloud.action.validated",
            request.resource.id,
            {
                "allowed": validation.allowed,
                "risk": validation.risk_level,
                "requires_approval": validation.requires_approval,
            },
        )
        return validation

    def plan_cloud_action(self, request: CloudActionRequest) -> CloudActionPlan:
        adapter = self._adapter(request.provider)
        validation = self.validate_cloud_action(request)
        proposed_changes = adapter.plan(request)
        plan = CloudActionPlan(
            id=stable_id(
                "cloud-plan",
                f"{request.actor}:{request.provider}:{request.resource.id}:{request.action}:{uuid4()}",
            ),
            request=request,
            validation=validation,
            proposed_changes=proposed_changes,
            blast_radius=_blast_radius(request, validation),
            rollback_plan=_rollback_plan(request),
            approvals=list(request.approvals),
            provider=request.provider,
            status="ready" if validation.allowed else "blocked",
            created_at=now_iso(),
            dry_run=True,
        )
        self.plans[plan.id] = plan
        self._publish(
            "cloud.action.planned",
            request.resource.id,
            {"plan_id": plan.id, "status": plan.status, "changes": proposed_changes},
        )
        return plan

    def execute_cloud_action(self, plan_id: str) -> CloudActionResult:
        plan = self.plans.get(plan_id)
        if plan is None:
            raise KeyError(f"unknown cloud action plan {plan_id}")
        if plan.status == "executed":
            return self.results[plan_id]
        if not plan.validation.allowed or plan.status != "ready":
            raise PermissionError("cloud action plan is not approved for execution")

        adapter = self._adapter(plan.provider)
        provider_result, observed_state = adapter.execute(plan)
        audit = self._audit(
            plan.request,
            "executed",
            {"plan_id": plan.id, "provider_result": provider_result},
        )
        result = CloudActionResult(
            plan_id=plan.id,
            status="succeeded" if provider_result.get("applied", True) else "noop",
            provider_result=provider_result,
            observed_state=observed_state,
            audit_id=audit.id,
            events=[audit],
        )
        plan.status = "executed"
        self.results[plan.id] = result
        self._publish(
            "cloud.action.executed",
            plan.request.resource.id,
            {
                "plan_id": plan.id,
                "status": result.status,
                "audit_id": result.audit_id,
                "digital_twin_update": observed_state.id if observed_state else None,
            },
        )
        return result

    def reconcile_resource(self, request: ReconciliationRequest) -> ReconciliationReport:
        actual = request.actual
        if actual is None:
            actual = self._adapter(request.provider).observe(
                request.desired.id,
                request.desired.type,
                request.desired.region,
            )
        drift = _state_drift(request.desired, actual)
        risk = _drift_risk(drift, request.environment)
        recommended = _recommended_repairs(request, drift)
        audit = self._audit_from_state(
            request.desired,
            "reconciled",
            {"drift_count": len(drift), "risk": risk},
        )
        report = ReconciliationReport(
            desired=request.desired,
            actual=actual,
            drift=drift,
            risk=risk,
            recommended_actions=recommended,
            events=[audit],
        )
        self._publish(
            "cloud.resource.reconciled",
            request.desired.id,
            {"drift_count": len(drift), "risk": risk},
        )
        return report

    def repair_resource(self, request: RepairRequest) -> RepairResult:
        action = _repair_action(request.strategy)
        resource = CloudResourceRef(
            type=request.resource.type,
            id=request.resource.id,
            name=request.resource.id,
            tags=request.resource.tags,
            data_class=request.resource.tags.get("data_class", "internal"),
            owner=request.resource.tags.get("owner"),
            cost_center=request.resource.tags.get("cost_center"),
        )
        action_request = CloudActionRequest(
            actor=request.actor,
            workspace_id=request.workspace_id,
            provider=request.resource.provider,
            account=request.resource.tags.get("account", "default"),
            region=request.resource.region,
            environment=request.environment,
            resource=resource,
            action=action,
            parameters=dict(request.parameters),
            role="sre",
            reason=f"repair:{request.strategy}",
            approvals=list(request.approvals),
            dry_run=True,
        )
        plan = self.plan_cloud_action(action_request)
        result = self.execute_cloud_action(plan.id)
        audit = self._audit_from_state(
            request.resource,
            "repair",
            {"strategy": request.strategy, "plan_id": plan.id},
        )
        return RepairResult(
            resource_id=request.resource.id,
            strategy=request.strategy,
            status=result.status,
            actions=[result],
            audit_id=audit.id,
        )

    def monitor_resource(self, state: CloudResourceState) -> CloudResourceState | None:
        return self._adapter(state.provider).observe(state.id, state.type, state.region)

    def provider_capabilities(self, provider: str) -> ProviderCapabilities:
        return self._adapter(provider).capabilities()

    def _adapter(self, provider: str) -> CloudProviderAdapter:
        adapter = self.adapters.get(provider)
        if adapter is None:
            raise KeyError(f"unsupported cloud provider {provider}")
        return adapter

    def _audit(
        self, request: CloudActionRequest, status: str, details: dict[str, Any]
    ) -> CloudAuditEvent:
        event = CloudAuditEvent(
            id=f"audit-{uuid4().hex[:10]}",
            actor=request.actor,
            action=request.action,
            provider=request.provider,
            resource_id=request.resource.id,
            environment=request.environment,
            status=status,
            trace_id=request.trace_id or f"trace-{uuid4().hex[:10]}",
            created_at=now_iso(),
            details=details,
        )
        self.audit_events.append(event)
        return event

    def _audit_from_state(
        self, state: CloudResourceState, action: str, details: dict[str, Any]
    ) -> CloudAuditEvent:
        event = CloudAuditEvent(
            id=f"audit-{uuid4().hex[:10]}",
            actor="cloud-controller",
            action=action,
            provider=state.provider,
            resource_id=state.id,
            environment=state.tags.get("environment", "unknown"),
            status="recorded",
            trace_id=f"trace-{uuid4().hex[:10]}",
            created_at=now_iso(),
            details=details,
        )
        self.audit_events.append(event)
        return event

    def _publish(self, event_type: str, subject: str, payload: dict[str, Any]) -> None:
        self.lifecycle_events.append(ControllerEvent(event_type, subject, payload, now_iso()))


def validate_cloud_action(request: CloudActionRequest) -> CloudActionValidation:
    return _DEFAULT_SERVICE.validate_cloud_action(request)


def plan_cloud_action(request: CloudActionRequest) -> CloudActionPlan:
    return _DEFAULT_SERVICE.plan_cloud_action(request)


def execute_cloud_action(plan_id: str) -> CloudActionResult:
    return _DEFAULT_SERVICE.execute_cloud_action(plan_id)


def reconcile_resource(request: ReconciliationRequest) -> ReconciliationReport:
    return _DEFAULT_SERVICE.reconcile_resource(request)


def repair_resource(request: RepairRequest) -> RepairResult:
    return _DEFAULT_SERVICE.repair_resource(request)


def _blast_radius(
    request: CloudActionRequest, validation: CloudActionValidation
) -> dict[str, Any]:
    return {
        "environment": request.environment,
        "provider": request.provider,
        "account": request.account,
        "resource": request.resource.id,
        "resource_type": request.resource.type,
        "risk_level": validation.risk_level,
        "estimated_cost_impact": validation.cost_impact,
        "production": request.environment.lower() == "prod",
    }


def _rollback_plan(request: CloudActionRequest) -> dict[str, Any]:
    action = request.action.lower()
    if action == "deploy":
        return {"action": "rollback", "revision": request.parameters.get("previous_revision", "previous")}
    if action == "scale":
        return {"action": "scale", "replicas": request.parameters.get("current_replicas", 1)}
    if action == "delete":
        return {"action": "restore-from-backup", "requires_manual_restore": True}
    if action == "provision":
        return {"action": "delete", "requires_approval": True}
    return {"action": "monitor", "note": "no automatic rollback required"}


def _state_drift(
    desired: CloudResourceState, actual: CloudResourceState | None
) -> list[dict[str, Any]]:
    if actual is None:
        return [{"path": "resource", "desired": desired.id, "actual": None}]
    drift = []
    if desired.status != actual.status:
        drift.append({"path": "status", "desired": desired.status, "actual": actual.status})
    drift.extend(deep_diff(desired.tags, actual.tags, "tags"))
    drift.extend(deep_diff(desired.configuration, actual.configuration, "configuration"))
    return drift


def _drift_risk(drift: list[dict[str, Any]], environment: str) -> str:
    if not drift:
        return "none"
    critical_paths = {"status", "resource"}
    if any(item["path"] in critical_paths for item in drift) or environment == "prod":
        return "high"
    if len(drift) >= 3:
        return "medium"
    return "low"


def _recommended_repairs(
    request: ReconciliationRequest, drift: list[dict[str, Any]]
) -> list[CloudActionRequest]:
    if not drift:
        return []
    action = "repair"
    if any(item["path"] == "resource" for item in drift):
        action = "provision"
    elif any(item["path"] == "status" for item in drift):
        action = "restart"
    resource = CloudResourceRef(
        type=request.desired.type,
        id=request.desired.id,
        tags=request.desired.tags,
        data_class=request.desired.tags.get("data_class", "internal"),
        owner=request.desired.tags.get("owner"),
        cost_center=request.desired.tags.get("cost_center"),
    )
    return [
        CloudActionRequest(
            actor="cloud-controller",
            workspace_id=request.workspace_id,
            provider=request.provider,
            account=request.desired.tags.get("account", "default"),
            region=request.desired.region,
            environment=request.environment,
            resource=resource,
            action=action,
            parameters={"drift": drift},
            role="sre",
            reason="reconciliation",
            dry_run=True,
        )
    ]


def _repair_action(strategy: str) -> str:
    return {
        "restart": "restart",
        "scale": "scale",
        "rollback": "rollback",
        "recreate": "repair",
    }.get(strategy, "repair")


_DEFAULT_SERVICE = CloudControllerService()
