# Observability — Developer Guide

> OpenTelemetry-based metrics, structured logs, distributed traces, alert rules, and Grafana dashboards.

## Overview (Phase 26)

Every service emits OTel spans, metrics, and structured logs. Data flows through the collector pipeline to Prometheus (metrics), Loki (logs), Tempo (traces), and Grafana (dashboards).

## Architecture

```
Services → OTel Collector → Prometheus (metrics)
                          → Loki (logs)
                          → Tempo / Jaeger (traces)
                          → Grafana (dashboards)
```

## Python SDK Usage

```python
from lattix_observability import ObservabilityClient

obs = ObservabilityClient(service_name="my-service", service_version="1.0.0")

# --- Metrics ---
counter = obs.counter("http_requests_total", labels={"method": "POST", "endpoint": "/api/agents"})
counter.increment()

histogram = obs.histogram("request_duration_ms", buckets=[10, 50, 100, 250, 500, 1000])
with histogram.time():
    do_something()

gauge = obs.gauge("active_connections")
gauge.set(42)

# --- Traces ---
with obs.span("process-request") as span:
    span.set_attribute("user.id", "owner@lattix.io")
    span.set_attribute("repo.id", "repo-platform")
    
    with obs.span("db-query") as db_span:
        db_span.set_attribute("db.statement", "SELECT * FROM tasks")
        result = db.execute(...)

# --- Structured Logs ---
obs.info("Task created", task_id="task-441", user="owner@lattix.io")
obs.warn("Consumer lag elevated", topic="events", lag=124, threshold=100)
obs.error("Model inference timeout", model="code-quality-classifier", timeout_ms=5000)
```

## Alert Rules

Alert definitions live in `observability/alerts/`:

```yaml
# observability/alerts/kafka-alerts.yaml
- alert: KafkaConsumerLagHigh
  expr: kafka_consumer_group_lag_sum > 100
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "Consumer lag elevated"
    description: "Topic {{ $labels.topic }} lag is {{ $value }}"
```

## Dashboards

Grafana dashboards are in `observability/dashboards/`:
- `platform-overview.json` — High-level health
- `ai-platform.json` — Agent runtime, model inference
- `infrastructure.json` — Kubernetes, pods, resources
- `kafka.json` — Kafka broker and consumer metrics

## SLOs

Service Level Objectives in `observability/slos/`:

```yaml
# API availability SLO: 99.9% uptime over 30 days
- name: api-availability
  service: api-gateway
  target: 99.9
  window: 30d
  indicator:
    type: availability
    good_event: http_request_success_total
    total_event: http_requests_total
```

## Running Tests

```bash
python -m pytest tests/test_observability.py -v
```

## Service URLs (when running full stack)

| Service | URL | Purpose |
|---------|-----|---------|
| Grafana | http://localhost:3000 | Dashboards (admin/admin) |
| Prometheus | http://localhost:9090 | Query metrics |
| Jaeger | http://localhost:16686 | Trace explorer |
| AlertManager | http://localhost:9093 | Alert routing |
