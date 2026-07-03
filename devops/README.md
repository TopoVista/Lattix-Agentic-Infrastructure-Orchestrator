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

## Future Phase Dependencies

- Phase 2 adds CI templates and hooks.
- Phase 25 implements CI/CD platform workflows.
- Phase 32 adds disaster recovery.
- Phase 34 adds chaos engineering.
