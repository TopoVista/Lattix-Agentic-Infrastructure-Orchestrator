# DevOps

## Purpose

Contains CI/CD workflows, release automation, deployment strategies, security scans, DR runbooks, chaos experiments, and operations playbooks.

## Owner Type

SRE, DevOps, and platform engineering.

## Conventions

- Pipeline definitions must be reproducible and reviewable.
- Production-impacting workflows require gates and approvals.
- Security scans and generated reports should be stored as artifacts, not committed outputs.
- Runbooks should include rollback and escalation paths.

## Implemented Package

`devops/lattix_cicd_platform` implements the Phase 25 CI/CD surface:

- `create_pipeline_run` creates a run from git event metadata, changed files, service maps, actor, and target environment.
- `execute_pipeline_stage` runs deterministic local stage handlers for static analysis, tests, AI review, container scanning, performance, build, registry push, deploy, and smoke.
- `run_ai_code_review` produces evidence-backed findings for tests, security-sensitive files, architecture, and risk.
- `choose_deployment_strategy` selects rolling, canary, blue-green, or manual based on environment, risk, migrations, SLOs, and failures.
- `promote_or_rollback` evaluates stage results, smoke tests, metrics, approvals, and policy to promote, pause, or rollback.
- `record_learning` emits deployment outcome lessons for memory, knowledge graph, observability, ML, and digital twin consumers.

## Environment Variables

- `CI_PROVIDER`
- `REGISTRY_URL`
- `ARGOCD_SERVER`
- `SONARQUBE_URL`
- `CONTAINER_SCAN_FAIL_ON_CRITICAL`
- `PERFORMANCE_TEST_ENABLED`
- `DEPLOYMENT_APPROVAL_REQUIRED`
- `CANARY_DEFAULT_PERCENT`

## Future Phase Dependencies

- Phase 2 adds CI templates and hooks.
- Phase 25 implements CI/CD platform workflows.
- Phase 32 adds disaster recovery.
- Phase 34 adds chaos engineering.
