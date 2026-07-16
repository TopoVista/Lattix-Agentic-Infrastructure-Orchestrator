from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class CostIngestionRequest(BaseModel):
    source: str
    period_start: datetime
    period_end: datetime

class CostIngestionRun(BaseModel):
    run_id: str
    status: str
    records_ingested: int
    completed_at: datetime

class CostAllocationRequest(BaseModel):
    period: str
    dimensions: List[str]

class CostAllocationReport(BaseModel):
    period: str
    dimensions: List[str]
    allocated_cost_usd: float
    unallocated_cost_usd: float
    confidence: str

class CostForecastRequest(BaseModel):
    target_period: str
    history_days: int

class CostForecast(BaseModel):
    period: str
    predicted_spend_usd: float
    confidence_interval: List[float]
    budget_risk: str
    drivers: List[str]

class CostAnomalyRequest(BaseModel):
    recent_hours: int

class CostAnomaly(BaseModel):
    resource: str
    amount_usd: float
    percent_change: float
    severity: str
    evidence: str
    likely_cause: str

class OptimizationRequest(BaseModel):
    target_subsystem: str

class CostRecommendation(BaseModel):
    type: str
    target: str
    expected_savings_usd_monthly: float
    risk: str
    steps: List[str]
    approval_required: bool
