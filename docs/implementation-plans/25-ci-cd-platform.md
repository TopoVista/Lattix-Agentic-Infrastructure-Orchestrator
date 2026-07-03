# Phase 25 - CI/CD Platform

## Goal

Build the Lattix CI/CD platform from git push through analysis, tests, AI code review, scans, build, deploy, smoke tests, canary, blue-green, production promotion, and learning.

## Why This Phase Exists

Deployment is one of the highest-risk engineering workflows. Lattix should make software delivery observable, policy-controlled, test-driven, reversible, and learnable so future agents can assist without bypassing safety.

## Success Criteria

- Pipeline stages are defined and implemented as reusable workflows.
- Static analysis, unit tests, integration tests, AI review, container scanning, performance tests, build, registry push, deploy, smoke, canary, blue-green, and promotion stages exist.
- Deployment decisions are auditable and policy checked.
- Pipeline outcomes feed memory, knowledge graph, observability, ML, and digital twin.

## Deliverables

- CI workflow templates.
- CD orchestrator.
- AI code review stage.
- Container scan stage.
- Performance test stage.
- Deployment strategy module.
- Smoke and rollback automation.
- Pipeline event contracts.

## Folder Structure

```text
devops/
  ci/
    workflows/
    stages/
  cd/
    orchestrator/
    strategies/
    smoke-tests/
    rollback/
  review/
  security-scans/
  performance/
  learning/
```

## Modules To Build

- Pipeline definition module.
- Static analysis module.
- Test execution module.
- AI code review module.
- Container scan module.
- Performance test module.
- Build and registry module.
- Deployment strategy module.
- Smoke test and rollback module.
- Learning feedback module.

## Functionality

- Trigger pipelines from git events.
- Run static analysis, unit tests, integration tests, AI review, container scanning, and performance checks.
- Build Docker images and push to registry.
- Deploy through Kubernetes and ArgoCD-ready workflows.
- Support canary and blue-green deployment strategies.
- Run smoke tests and automatic rollback when policy allows.
- Record pipeline evidence and lessons learned.

## Tech Stack

- GitHub Actions.
- ArgoCD.
- Jenkins-ready adapter.
- Docker.
- Kubernetes.
- Helm.
- Trivy or Grype for container scanning.
- SonarQube.
- k6 or Gatling for performance tests.
- OpenTelemetry and Kafka.

## Implementation Plan

1. Define pipeline stage contract and event model.
2. Create reusable CI workflows for frontend, backend, AI services, infrastructure, and docs.
3. Add static analysis and lint stages per language.
4. Add unit and integration test stages with artifact capture.
5. Add AI code review stage using repository intelligence and role agents.
6. Add container scanning and SBOM generation.
7. Add performance test stage for changed services.
8. Add Docker build and registry push stage.
9. Add deployment orchestrator with canary, blue-green, smoke, promotion, and rollback.
10. Publish pipeline outcomes to knowledge graph, memory, observability, and ML datasets.

## Functions / Classes / Interfaces To Implement

```python
def create_pipeline_run(request: PipelineRunRequest) -> PipelineRun:
    # Creates a run from git event, changed files, service map, actor, and target environment.

def execute_pipeline_stage(run_id: str, stage: PipelineStage) -> StageResult:
    # Runs one pipeline stage, captures logs, artifacts, metrics, status, and evidence.

def run_ai_code_review(request: AiCodeReviewRequest) -> CodeReviewReport:
    # Reviews changes for correctness, security, tests, architecture, and risk with citations.

def choose_deployment_strategy(request: DeploymentStrategyRequest) -> DeploymentStrategy:
    # Chooses canary, blue-green, rolling, or manual deployment based on risk and service profile.

def promote_or_rollback(request: PromotionDecisionRequest) -> DeploymentDecision:
    # Evaluates smoke, metrics, errors, and policy to promote, pause, or rollback.
```

## Configuration / Environment Variables

- `CI_PROVIDER`
- `REGISTRY_URL`
- `ARGOCD_SERVER`
- `SONARQUBE_URL`
- `CONTAINER_SCAN_FAIL_ON_CRITICAL`
- `PERFORMANCE_TEST_ENABLED`
- `DEPLOYMENT_APPROVAL_REQUIRED`
- `CANARY_DEFAULT_PERCENT`

## Data Models / Schemas / Contracts

- `PipelineRun`: id, repo, commit, actor, environment, stages, status, artifacts.
- `PipelineStage`: name, type, dependencies, timeout, required, policy.
- `StageResult`: stage, status, logsRef, artifacts, metrics, findings.
- `CodeReviewReport`: findings, severity, files, evidence, recommendedFixes.
- `DeploymentStrategy`: type, steps, trafficPolicy, rollbackPolicy, approvals.
- `DeploymentDecision`: decision, reasons, metrics, smokeResults, auditId.

## Testing Plan

- Workflow syntax validation.
- Unit tests for strategy selection and promotion decisions.
- Mock pipeline stage tests.
- Container scan fixture tests.
- End-to-end pipeline smoke test for a sample service.
- Failure tests for test failure, scan failure, smoke failure, and rollback.

## Acceptance Criteria

- A service can move from commit to controlled deployment through the pipeline.
- Failed checks stop promotion.
- AI review produces evidence-backed findings.
- Deployment outcomes are observable and recorded for learning.

## Risks And Mitigations

- Risk: pipeline is too slow. Mitigation: changed-service detection and parallel stages.
- Risk: AI review blocks good changes. Mitigation: advisory mode first, policy-based enforcement later.
- Risk: bad deployment reaches production. Mitigation: canary, smoke tests, metrics gates, and rollback.

## Next Phase Handoff

Phase 26 should expand observability so pipeline, deployment, runtime, and agent behavior are visible end to end.
