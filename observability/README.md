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

## Implemented Package

`observability/lattix_observability` implements the Phase 26 surface:

- `propagate_trace` adds trace, correlation, actor, workspace, task, and request context to downstream HTTP or event calls.
- `record_platform_metric` standardizes metric names, required labels, high-cardinality warnings, units, and timestamps.
- `create_structured_log` emits structured JSON-ready logs with recursive redaction.
- `evaluate_alert_rule` evaluates simple metric window expressions and returns state, severity, routing, and evidence.
- `compute_slo_report` calculates availability, latency p95, error budget, burn rate, and compliance.
- `define_dashboard` validates dashboard definitions, and `export_observability_summary` emits facts for analytics, knowledge graph, memory, ML, and digital twin.

## Environment Variables

- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `OTEL_SERVICE_NAME`
- `PROMETHEUS_SCRAPE_INTERVAL`
- `LOKI_URL`
- `JAEGER_ENDPOINT`
- `TEMPO_ENDPOINT`
- `GRAFANA_URL`
- `ALERTMANAGER_URL`
- `LOG_REDACTION_ENABLED`

## Future Phase Dependencies

- Phase 26 implements observability.
- Phase 37 uses telemetry for benchmarks.
- Phase 40 uses telemetry for production readiness.
