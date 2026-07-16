from __future__ import annotations

from .models import CloudActionRequest, CloudActionValidation, CloudPolicyFinding
from .runtime import env_flag, env_float, stable_id


DESTRUCTIVE_ACTIONS = {"delete", "recreate", "policy-change"}
PRODUCTION_IMPACTING_ACTIONS = {
    "provision",
    "deploy",
    "scale",
    "restart",
    "rollback",
    "delete",
    "repair",
    "policy-change",
}
REQUIRED_TAGS = {"project", "environment", "owner", "cost_center", "data_class"}


def validate_policy(request: CloudActionRequest) -> CloudActionValidation:
    findings: list[CloudPolicyFinding] = []
    required_approvals: list[str] = []
    action = request.action.lower()
    environment = request.environment.lower()
    destructive = action in DESTRUCTIVE_ACTIONS
    production_impacting = environment == "prod" and action in PRODUCTION_IMPACTING_ACTIONS
    approval_required_by_env = env_flag("CLOUD_ACTION_APPROVAL_REQUIRED", True)
    dry_run_required = env_flag("CLOUD_ACTION_DRY_RUN_REQUIRED", True)
    cost_impact = _estimate_cost_impact(request)

    missing_tags = sorted(REQUIRED_TAGS - set(request.resource.tags))
    if missing_tags:
        findings.append(
            CloudPolicyFinding(
                "required-tags",
                "high",
                f"resource is missing required tags: {', '.join(missing_tags)}",
            )
        )

    if request.role not in {"admin", "sre", "platform", "deployer"} and action != "monitor":
        findings.append(
            CloudPolicyFinding(
                "actor-role",
                "high",
                f"role {request.role} cannot execute cloud write action {action}",
                requires_approval=True,
            )
        )
        required_approvals.append("platform")

    if destructive:
        findings.append(
            CloudPolicyFinding(
                "destructive-action",
                "critical",
                f"action {action} can delete or replace infrastructure",
                requires_approval=True,
            )
        )
        required_approvals.append("resource-owner")

    if production_impacting:
        findings.append(
            CloudPolicyFinding(
                "production-impact",
                "critical",
                "production-impacting cloud action requires approval",
                requires_approval=True,
            )
        )
        required_approvals.append("production-approver")

    if request.resource.data_class in {"restricted", "secret", "regulated"} and action != "monitor":
        findings.append(
            CloudPolicyFinding(
                "data-class",
                "critical",
                f"{request.resource.data_class} resource changes require security approval",
                requires_approval=True,
            )
        )
        required_approvals.append("security")

    cost_threshold = env_float("CLOUD_COST_APPROVAL_THRESHOLD", 250.0)
    if cost_impact >= cost_threshold:
        findings.append(
            CloudPolicyFinding(
                "cost-impact",
                "medium",
                f"estimated monthly cost impact ${cost_impact:.2f} exceeds threshold",
                requires_approval=True,
            )
        )
        required_approvals.append("finops")

    if dry_run_required and action in {"provision", "scale", "delete", "rollback", "policy-change"}:
        if not request.dry_run:
            findings.append(
                CloudPolicyFinding(
                    "dry-run-required",
                    "high",
                    "dry-run is required before execution",
                )
            )

    required_approvals = sorted(set(required_approvals))
    has_approvals = set(required_approvals).issubset(set(request.approvals))
    requires_approval = approval_required_by_env and bool(required_approvals)
    blocking_findings = [
        finding
        for finding in findings
        if not finding.requires_approval or (requires_approval and not has_approvals)
    ]
    allowed = not blocking_findings and (not requires_approval or has_approvals)
    return CloudActionValidation(
        request_id=stable_id(
            "cloud-validation",
            f"{request.actor}:{request.provider}:{request.resource.id}:{request.action}",
        ),
        allowed=allowed,
        risk_level=_risk_level(findings, destructive, production_impacting),
        requires_approval=requires_approval,
        requires_dry_run=dry_run_required,
        destructive=destructive,
        cost_impact=cost_impact,
        findings=findings,
        required_approvals=required_approvals,
        reasons=[finding.message for finding in blocking_findings],
    )


def _risk_level(
    findings: list[CloudPolicyFinding], destructive: bool, production_impacting: bool
) -> str:
    severities = {finding.severity for finding in findings}
    if destructive or production_impacting or "critical" in severities:
        return "critical"
    if "high" in severities:
        return "high"
    if "medium" in severities:
        return "medium"
    return "low"


def _estimate_cost_impact(request: CloudActionRequest) -> float:
    if "estimated_monthly_cost" in request.parameters:
        return float(request.parameters["estimated_monthly_cost"])
    action = request.action.lower()
    if action == "provision":
        return 150.0
    if action == "scale":
        desired = request.parameters.get("replicas", request.parameters.get("desired_count", 1))
        return max(0.0, float(desired) * 20.0)
    if action == "delete":
        return -100.0
    return 0.0
