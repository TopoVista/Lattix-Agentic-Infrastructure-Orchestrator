from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class ChaosExperimentSpec(BaseModel):
    name: str
    hypothesis: str
    target: str
    fault: str
    scope: str
    duration_minutes: int
    abort_conditions: List[str]

class ChaosRun(BaseModel):
    id: str
    experiment_id: str
    environment: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    audit_id: str

class AbortDecision(BaseModel):
    abort: bool
    reasons: List[str]
    metrics: Dict[str, Any]
    timestamp: datetime

class ChaosReport(BaseModel):
    run_id: str
    hypothesis_result: str
    impact: str
    metrics: Dict[str, Any]
    timeline: List[str]
    findings: List[str]
    actions: List[str]

class ResilienceActionItem(BaseModel):
    type: str
    owner: str
    priority: str
    evidence: str
    due_date: datetime
