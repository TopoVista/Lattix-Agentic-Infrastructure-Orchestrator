# Observability

## Purpose

Contains telemetry standards, OpenTelemetry collector configs, metrics, logs, traces, dashboards, alerts, SLOs, and operational exports.

## Owner Type

SRE and platform engineering.

## Conventions

- Every service and agent should emit metrics, logs, traces, and audit-relevant context.
- Logs must be structured and redacted.
- Dashboards should map to SLOs, runbooks, or operational decisions.
- High-cardinality labels require review.

## Future Phase Dependencies

- Phase 26 implements observability.
- Phase 37 uses telemetry for benchmarks.
- Phase 40 uses telemetry for production readiness.
