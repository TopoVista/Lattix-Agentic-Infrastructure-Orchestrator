from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol

from .models import (
    CloudActionPlan,
    CloudActionRequest,
    CloudResourceState,
    ProviderCapabilities,
)
from .runtime import now_iso


class CloudProviderAdapter(Protocol):
    provider: str

    def capabilities(self) -> ProviderCapabilities:
        ...

    def plan(self, request: CloudActionRequest) -> list[dict]:
        ...

    def execute(self, plan: CloudActionPlan) -> tuple[dict, CloudResourceState | None]:
        ...

    def observe(self, resource_id: str, resource_type: str, region: str) -> CloudResourceState | None:
        ...


@dataclass(slots=True)
class AwsProviderAdapter:
    provider: str = "aws"
    resources: dict[str, CloudResourceState] = field(default_factory=dict)

    def capabilities(self) -> ProviderCapabilities:
        return ProviderCapabilities(
            provider=self.provider,
            supported_actions=[
                "provision",
                "deploy",
                "scale",
                "restart",
                "rollback",
                "delete",
                "monitor",
                "repair",
                "policy-change",
            ],
            resource_types=[
                "ecs-service",
                "eks-deployment",
                "rds-instance",
                "s3-bucket",
                "lambda-function",
                "load-balancer",
                "autoscaling-group",
            ],
            dry_run_actions=["provision", "scale", "delete", "rollback", "policy-change"],
        )

    def plan(self, request: CloudActionRequest) -> list[dict]:
        resource_name = request.resource.name or request.resource.id
        changes = {
            "action": request.action,
            "resource": request.resource.id,
            "resource_type": request.resource.type,
            "provider": self.provider,
            "region": request.region,
            "parameters": dict(request.parameters),
        }
        if request.action == "scale":
            changes["from"] = self.resources.get(request.resource.id, _placeholder_state(request)).configuration.get(
                "replicas", 1
            )
            changes["to"] = request.parameters.get("replicas", request.parameters.get("desired_count", 1))
        elif request.action == "provision":
            changes["create"] = resource_name
            changes["tags"] = request.resource.tags
        elif request.action == "delete":
            changes["delete"] = resource_name
        elif request.action == "rollback":
            changes["target_revision"] = request.parameters.get("revision", "previous")
        return [changes]

    def execute(self, plan: CloudActionPlan) -> tuple[dict, CloudResourceState | None]:
        request = plan.request
        if request.action == "monitor":
            observed = self.observe(request.resource.id, request.resource.type, request.region)
            return {"operation": "monitor", "found": observed is not None}, observed
        if request.action == "delete":
            observed = self.resources.pop(request.resource.id, None)
            deleted = observed or _state_from_request(request, status="deleted")
            deleted.status = "deleted"
            return {"operation": "delete", "resource_id": request.resource.id}, deleted
        status = "running"
        if request.action == "restart":
            status = "restarted"
        elif request.action == "rollback":
            status = "rolled_back"
        elif request.action == "repair":
            status = "healthy"
        observed = _state_from_request(request, status=status)
        if request.action == "scale":
            observed.configuration["replicas"] = request.parameters.get(
                "replicas", request.parameters.get("desired_count", 1)
            )
        if request.action == "deploy":
            observed.configuration["image"] = request.parameters.get("image", "unchanged")
            observed.configuration["revision"] = request.parameters.get("revision", "latest")
        self.resources[request.resource.id] = observed
        return {"operation": request.action, "provider": self.provider, "applied": True}, observed

    def observe(self, resource_id: str, resource_type: str, region: str) -> CloudResourceState | None:
        state = self.resources.get(resource_id)
        if state is None:
            return None
        state.last_seen_at = now_iso()
        return state


@dataclass(slots=True)
class StubProviderAdapter:
    provider: str
    planned_resource_types: list[str]

    def capabilities(self) -> ProviderCapabilities:
        return ProviderCapabilities(
            provider=self.provider,
            supported_actions=["monitor", "validate", "plan"],
            resource_types=self.planned_resource_types,
            dry_run_actions=["plan"],
            status="contract_only",
        )

    def plan(self, request: CloudActionRequest) -> list[dict]:
        return [
            {
                "action": request.action,
                "provider": self.provider,
                "resource": request.resource.id,
                "status": "contract-only no-op",
            }
        ]

    def execute(self, plan: CloudActionPlan) -> tuple[dict, CloudResourceState | None]:
        return (
            {
                "operation": plan.request.action,
                "provider": self.provider,
                "applied": False,
                "reason": "provider adapter is contract-only",
            },
            None,
        )

    def observe(self, resource_id: str, resource_type: str, region: str) -> CloudResourceState | None:
        return None


def default_provider_adapters() -> dict[str, CloudProviderAdapter]:
    return {
        "aws": AwsProviderAdapter(),
        "gcp": StubProviderAdapter("gcp", ["gke-deployment", "cloud-sql", "cloud-storage"]),
        "azure": StubProviderAdapter("azure", ["aks-deployment", "postgresql", "blob-storage"]),
    }


def _placeholder_state(request: CloudActionRequest) -> CloudResourceState:
    return _state_from_request(request, "unknown")


def _state_from_request(request: CloudActionRequest, status: str) -> CloudResourceState:
    configuration = {
        "parameters": dict(request.parameters),
        "environment": request.environment,
    }
    if "replicas" in request.parameters:
        configuration["replicas"] = request.parameters["replicas"]
    return CloudResourceState(
        provider=request.provider,
        type=request.resource.type,
        id=request.resource.id,
        region=request.region,
        tags=dict(request.resource.tags),
        status=status,
        configuration=configuration,
        last_seen_at=now_iso(),
    )
