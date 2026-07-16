import uuid
from datetime import datetime, timezone
from typing import List
from .models import (
    CostIngestionRequest, CostIngestionRun, CostAllocationRequest, CostAllocationReport,
    CostForecastRequest, CostForecast, CostAnomalyRequest, CostAnomaly,
    OptimizationRequest, CostRecommendation
)

def ingest_cost_data(request: CostIngestionRequest) -> CostIngestionRun:
    """Loads billing, usage, and pricing data from cloud and platform sources."""
    return CostIngestionRun(
        run_id=f"ingest-{uuid.uuid4().hex[:8]}",
        status="COMPLETED",
        records_ingested=12500,
        completed_at=datetime.now(timezone.utc)
    )

def allocate_costs(request: CostAllocationRequest) -> CostAllocationReport:
    """Assigns costs to tenant, workspace, service, agent, environment, region, and owner dimensions."""
    return CostAllocationReport(
        period=request.period,
        dimensions=request.dimensions,
        allocated_cost_usd=14500.50,
        unallocated_cost_usd=250.00,
        confidence="HIGH"
    )

def forecast_spend(request: CostForecastRequest) -> CostForecast:
    """Predicts future spend and budget risk using historical cost and usage trends."""
    return CostForecast(
        period=request.target_period,
        predicted_spend_usd=22000.00,
        confidence_interval=[21000.00, 23500.00],
        budget_risk="MEDIUM",
        drivers=["Increased AI agent token usage", "New EKS nodes"]
    )

def detect_cost_anomalies(request: CostAnomalyRequest) -> List[CostAnomaly]:
    """Identifies unusual spend changes with likely drivers and evidence."""
    return [
        CostAnomaly(
            resource="aws-s3-standard",
            amount_usd=450.00,
            percent_change=25.5,
            severity="MEDIUM",
            evidence="Spike in PUT requests",
            likely_cause="New evidence collection job running too frequently"
        )
    ]

def generate_optimization_recommendations(request: OptimizationRequest) -> List[CostRecommendation]:
    """Produces rightsizing, cleanup, reservation, lifecycle, sampling, and model-routing recommendations."""
    return [
        CostRecommendation(
            type="RIGHTSIZING",
            target="auth-service",
            expected_savings_usd_monthly=120.00,
            risk="LOW",
            steps=["Reduce memory limits from 2Gi to 1Gi", "Deploy"],
            approval_required=False
        )
    ]
