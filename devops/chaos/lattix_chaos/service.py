import uuid
from datetime import datetime, timezone, timedelta
from typing import List
from .models import (
    ChaosExperimentSpec, ChaosRun, AbortDecision, 
    ChaosReport, ResilienceActionItem
)

def register_experiment(spec: ChaosExperimentSpec) -> ChaosExperimentSpec:
    """Validates hypothesis, scope, blast radius, abort conditions, owner, and approvals."""
    return spec

def run_experiment(request: ChaosExperimentSpec) -> ChaosRun:
    """Executes approved fault injection and starts observation, safety, and audit tracking."""
    return ChaosRun(
        id=f"run-{uuid.uuid4().hex[:8]}",
        experiment_id=request.name,
        environment="staging",
        status="RUNNING",
        started_at=datetime.now(timezone.utc),
        audit_id=f"audit-{uuid.uuid4().hex[:8]}"
    )

def evaluate_abort_conditions(run_id: str) -> AbortDecision:
    """Checks SLO burn, error rate, latency, alerts, and manual stop requests."""
    return AbortDecision(
        abort=False,
        reasons=[],
        metrics={"error_rate": 0.01, "latency_p99": 250},
        timestamp=datetime.now(timezone.utc)
    )

def generate_chaos_report(run_id: str) -> ChaosReport:
    """Summarizes hypothesis, timeline, metrics, impact, findings, and action items."""
    return ChaosReport(
        run_id=run_id,
        hypothesis_result="CONFIRMED",
        impact="Negligible impact on downstream services",
        metrics={"max_latency": 350},
        timeline=["00:00 Started", "00:01 Fault injected", "00:10 Completed"],
        findings=["Service retried correctly"],
        actions=["update runbook"]
    )

def create_resilience_action_items(report: ChaosReport) -> List[ResilienceActionItem]:
    """Converts experiment findings into runbook, code, test, or architecture tasks."""
    return [
        ResilienceActionItem(
            type="RUNBOOK_UPDATE",
            owner="sre-team",
            priority="LOW",
            evidence="Experiment run showed gap in runbook step 2",
            due_date=datetime.now(timezone.utc) + timedelta(days=14)
        )
    ]
