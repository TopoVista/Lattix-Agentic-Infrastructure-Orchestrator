from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class WorkloadSpec(BaseModel):
    tenants: int
    users: int
    repos: int
    files: int
    chats: int
    agents: int
    events: int
    duration_minutes: int

class WorkloadDataset(BaseModel):
    id: str
    spec: WorkloadSpec
    generated_at: datetime
    data_url: str

class BenchmarkRunRequest(BaseModel):
    scenario: str
    run_type: str
    environment: str

class BenchmarkRun(BaseModel):
    id: str
    scenario: str
    run_type: str
    environment: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None

class BenchmarkMetric(BaseModel):
    run_id: str
    name: str
    value: float
    unit: str
    percentile: Optional[str] = None
    timestamp: datetime

class RegressionReport(BaseModel):
    baseline_run_id: str
    current_run_id: str
    regressions: List[str]
    improvements: List[str]
    decision: str

class BenchmarkReport(BaseModel):
    run_id: str
    metrics: List[BenchmarkMetric]
    bottlenecks: List[str]
    next_actions: List[str]

class CapacityRecommendation(BaseModel):
    subsystem: str
    bottleneck: str
    recommended_change: str
    expected_impact: str
