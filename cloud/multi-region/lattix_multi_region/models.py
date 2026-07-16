from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class Region(BaseModel):
    id: str
    cloud_provider: str
    location: str
    status: str
    capabilities: List[str]
    compliance_tags: List[str]

class TenantPlacementRequest(BaseModel):
    tenant_id: str
    compliance_requirements: List[str]

class TenantPlacement(BaseModel):
    tenant_id: str
    home_region: str
    allowed_regions: List[str]
    replication_policy: str
    residency_tags: List[str]

class RegionRoutingRequest(BaseModel):
    tenant_id: str
    service: str

class RegionRoutingDecision(BaseModel):
    region: str
    reason: str
    fallback_region: Optional[str]
    policy: str

class RegionHealthReport(BaseModel):
    region: str
    status: str
    failures: List[str]
    latency_ms: int
    datastore_health: str
    timestamp: datetime

class FailoverRequest(BaseModel):
    source_region: str
    target_region: str
    services: List[str]

class FailoverPlan(BaseModel):
    id: str
    source_region: str
    target_region: str
    steps: List[str]
    data_risk: str
    approvals_required: List[str]
    rollback_steps: List[str]

class FailoverResult(BaseModel):
    plan_id: str
    status: str
    completed_steps: List[str]
    timestamp: datetime
