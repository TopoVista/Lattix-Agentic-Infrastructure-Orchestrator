from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

from .models import CloudActionRequest
from .service import CloudControllerService


@dataclass(slots=True)
class CloudControllerFacade:
    service: CloudControllerService

    def health(self) -> dict[str, Any]:
        return {
            "status": "ok",
            "providers": sorted(self.service.adapters),
            "plans": len(self.service.plans),
            "audit_events": len(self.service.audit_events),
        }

    def validate(self, request: CloudActionRequest) -> dict[str, Any]:
        return asdict(self.service.validate_cloud_action(request))

    def plan(self, request: CloudActionRequest) -> dict[str, Any]:
        return asdict(self.service.plan_cloud_action(request))

    def execute(self, plan_id: str) -> dict[str, Any]:
        return asdict(self.service.execute_cloud_action(plan_id))

    def capabilities(self, provider: str) -> dict[str, Any]:
        return asdict(self.service.provider_capabilities(provider))


def create_fastapi_app(service: CloudControllerService | None = None):
    try:
        from fastapi import FastAPI
    except ImportError as exc:
        raise RuntimeError("FastAPI is required to create the cloud controller API") from exc

    service = service or CloudControllerService()
    facade = CloudControllerFacade(service)
    app = FastAPI(title="Lattix Cloud Controllers", version="0.1.0")

    @app.get("/health")
    def health() -> dict[str, Any]:
        return facade.health()

    @app.get("/providers/{provider}/capabilities")
    def capabilities(provider: str) -> dict[str, Any]:
        return facade.capabilities(provider)

    @app.post("/actions/validate")
    def validate(request: dict[str, Any]) -> dict[str, Any]:
        return facade.validate(CloudActionRequest(**request))

    @app.post("/actions/plan")
    def plan(request: dict[str, Any]) -> dict[str, Any]:
        return facade.plan(CloudActionRequest(**request))

    @app.post("/actions/{plan_id}/execute")
    def execute(plan_id: str) -> dict[str, Any]:
        return facade.execute(plan_id)

    return app
