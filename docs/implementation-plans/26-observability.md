# Phase 26 - Observability

## Goal

Build Lattix observability across metrics, logs, traces, dashboards, alerts, service-level objectives, and AI/agent telemetry.

## Why This Phase Exists

An agentic infrastructure platform must explain what happened, why it happened, who or what acted, and whether the system is healthy. Observability also feeds ML, digital twin, incident response, cost optimization, and adaptive controls.

## Success Criteria

- OpenTelemetry instrumentation exists across gateway, services, agents, AI services, pipelines, and cloud controllers.
- Metrics, logs, and traces are collected through Prometheus, Grafana, Jaeger, Loki, Tempo, ELK, and CloudWatch integrations.
- Dashboards exist for platform health, service health, agents, pipelines, deployments, cloud, and cost.
- Alerts and SLOs are defined.
- Observability data feeds data platform and knowledge graph.

## Deliverables

- OpenTelemetry standards.
- Collector configuration.
- Metrics and logging libraries.
- Dashboards.
- Alerts and SLOs.
- Trace correlation rules.
- Observability event exports.

## Folder Structure

```text
observability/
  otel/
    collector/
    instrumentation/
  metrics/
  logs/
  traces/
  dashboards/
  alerts/
  slos/
  exports/
```

## Modules To Build

- Instrumentation module.
- Metrics module.
- Logging module.
- Tracing module.
- Dashboard module.
- Alerting module.
- SLO module.
- Observability export module.

## Functionality

- Collect request, job, tool, agent, pipeline, deployment, database, Kafka, cache, model, and cloud metrics.
- Correlate logs and traces with request IDs, actor IDs, workspace IDs, task IDs, and deployment IDs.
- Provide dashboards for operational health.
- Alert on availability, latency, errors, saturation, DLQs, failed tasks, failed deployments, model drift, and cost anomalies.
- Export observability facts to analytics and knowledge graph.

## Tech Stack

- OpenTelemetry.
- Prometheus.
- Grafana.
- Jaeger.
- Tempo.
- Loki.
- ELK or OpenSearch logs.
- CloudWatch.
- Alertmanager.

## Implementation Plan

1. Define telemetry naming standards and required attributes.
2. Add OpenTelemetry collector configuration for local and cloud environments.
3. Add shared instrumentation helpers for Java, TypeScript, and Python.
4. Add structured logging schema with redaction rules.
5. Add metrics for gateway, services, agents, AI, pipelines, Kafka, databases, and cloud controllers.
6. Add trace propagation across HTTP, Kafka, tools, and agent steps.
7. Create dashboards for platform overview, service detail, agents, CI/CD, cloud, data, ML, and user workflows.
8. Define SLOs and alert rules.
9. Export observability summaries to ClickHouse, knowledge graph, and memory.

## Functions / Classes / Interfaces To Implement

```java
TraceContext propagateTrace(TraceContext current, OutgoingRequest request)
// Adds trace, correlation, actor, workspace, and task context to downstream HTTP or event calls.

MetricRecord recordPlatformMetric(MetricInput input)
// Records standardized service, agent, pipeline, cloud, or model metrics with labels.

StructuredLog createStructuredLog(LogInput input)
// Produces redacted JSON logs with severity, trace id, actor, workspace, and event metadata.

AlertEvaluation evaluateAlertRule(AlertRule rule, MetricWindow window)
// Determines alert state, severity, routing, and evidence from metric windows.

SloReport computeSloReport(SloDefinition definition)
// Computes availability, latency, error budget, burn rate, and compliance over a time window.
```

## Configuration / Environment Variables

- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `OTEL_SERVICE_NAME`
- `PROMETHEUS_SCRAPE_INTERVAL`
- `LOKI_URL`
- `JAEGER_ENDPOINT`
- `TEMPO_ENDPOINT`
- `GRAFANA_URL`
- `ALERTMANAGER_URL`
- `LOG_REDACTION_ENABLED`

## Data Models / Schemas / Contracts

- `MetricInput`: name, value, unit, labels, timestamp.
- `StructuredLog`: timestamp, severity, message, traceId, actor, workspace, fields.
- `TraceContext`: traceId, spanId, correlationId, taskId, requestId.
- `AlertRule`: name, expression, severity, routing, silencePolicy.
- `SloDefinition`: service, objective, sli, target, window, owner.

## Testing Plan

- Unit tests for log redaction and metric label validation.
- Trace propagation tests across HTTP and Kafka.
- Dashboard JSON validation.
- Alert rule tests with synthetic metric windows.
- End-to-end smoke test verifying a request produces metrics, logs, and traces.

## Acceptance Criteria

- Platform workflows can be traced across frontend, gateway, services, events, agents, and tools.
- Dashboards show actionable health data.
- Alerts have owners and severity.
- Observability data is reusable by ML, digital twin, and incident agents.

## Risks And Mitigations

- Risk: telemetry volume is too high. Mitigation: sampling, retention tiers, and metric cardinality rules.
- Risk: logs leak sensitive data. Mitigation: structured redaction and tests.
- Risk: dashboards become decorative. Mitigation: tie dashboards to SLOs and runbooks.

## Next Phase Handoff

Phase 27 should combine code, infra, data, cloud, observability, docs, memory, and decisions into the digital twin.
