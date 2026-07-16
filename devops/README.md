# DevOps — Developer Guide

> CI/CD pipelines, chaos engineering, disaster recovery, security scans, cache, database, and performance operations.

## Directory Structure

```
devops/
├── ci/                     Continuous Integration (Phase 25)
├── cd/                     Continuous Delivery (Phase 25)
│   ├── orchestrator/       Deployment orchestration
│   ├── strategies/         Blue-green, canary, rolling strategies
│   ├── rollback/           Automated rollback contracts
│   └── smoke-tests/        Post-deploy smoke test contracts
├── chaos/                  Chaos Engineering (Phase 34)
│   └── lattix_chaos/       Chaos experiment Python modules
├── disaster-recovery/      Disaster Recovery (Phase 32)
├── cache/                  Redis Cluster management (Phase 28)
├── database/               DB scaling operations (Phase 29)
├── security/               Security scans (Phase 35)
├── security-scans/         SAST/DAST/SCA scan results
├── performance/            Performance benchmarks (Phase 37)
├── review/                 AI-assisted code review
├── learning/               CI/CD learning loop
└── hooks/                  Git pre-commit and pre-push hooks
```

---

## CI/CD Platform (Phase 25)

### Pipeline Stages

```
Git Push
  → 1. Lint          (ESLint, ruff, ktlint, yamllint)
  → 2. Test          (Vitest, pytest, JUnit)
  → 3. Build         (Next.js, Docker images, Gradle)
  → 4. Scan          (Trivy, Checkov, Bandit, OWASP)
  → 5. AI Review     (Code quality, security, performance)
  → 6. Deploy        (Staging → Smoke → Canary → Production)
  → 7. Learning      (Store results for future predictions)
```

### Deployment Strategies

#### Blue-Green Deployment
```yaml
# devops/cd/strategies/strategies.yaml
strategy: blue-green
traffic:
  blue: 100%   # current production
  green: 0%    # new version (getting deployed)
steps:
  - deploy_green
  - health_check_green
  - switch_traffic_100_green
  - keep_blue_for_30m  # rollback window
  - decommission_blue
```

#### Canary Deployment
```yaml
strategy: canary
steps:
  - deploy_canary: 5%
  - monitor: 10m
  - promote: 25%
  - monitor: 10m
  - promote: 100%
rollback_trigger:
  error_rate_threshold: 1%
  latency_p99_threshold: 500ms
```

### Running CI Locally

```powershell
# Run the full local CI pipeline
.\.venv\Scripts\Activate.ps1

# Lint all Python
python -m ruff check .

# Run all tests
python -m pytest tests/ -q

# Run frontend tests
cd frontend/apps/web
pnpm test
pnpm build  # Verify production build

# Run security scan
python -m bandit -r . -x .venv,node_modules
```

### Pre-commit Hooks

```bash
# Install hooks (first time)
pre-commit install

# Run all hooks manually
pre-commit run --all-files
```

Hooks configured in `.pre-commit-config.yaml`:
- `ruff` — Python linting and formatting
- `yamllint` — YAML validation
- `commitlint` — Commit message format
- `checkov` — IaC security scanning
- `tflint` — Terraform linting

---

## Chaos Engineering (Phase 34)

### Python Usage

```python
from devops.chaos.lattix_chaos import ChaosService, ChaosExperiment

chaos = ChaosService()

# Define an experiment
experiment = ChaosExperiment(
    name="auth-service-pod-kill",
    target_service="auth-service",
    target_namespace="lattix-prod",
    fault_type="pod-kill",
    duration_seconds=60,
    safety_check=True  # Always verify system health before running
)

# Run the experiment
result = chaos.run(experiment)
print(f"Recovery time: {result.recovery_seconds}s")
print(f"SLO maintained: {result.slo_maintained}")
print(f"Blast radius: {result.affected_services}")
```

### Available Fault Types

| Fault | Target | Description |
|-------|--------|-------------|
| `pod-kill` | Service pod | Terminates a pod, tests restart |
| `network-partition` | Service | Drops network connectivity |
| `cpu-stress` | Service | Throttles CPU to specified % |
| `memory-pressure` | Service | Fills memory to threshold |
| `kafka-broker-kill` | Kafka | Kills a Kafka broker, tests rebalancing |
| `db-connection-drop` | Database | Closes all DB connections |
| `latency-inject` | Network | Adds artificial latency |
| `disk-fill` | Node | Fills disk to threshold |

### Safety Guards
- Pre-flight health check before every experiment
- Auto-abort if error rate exceeds `2%`
- Auto-rollback if experiment runs over time limit
- All experiments logged and reported to observability

---

## Disaster Recovery (Phase 32)

### Runbooks

Runbooks are in `devops/disaster-recovery/`:

```bash
# List all runbooks
ls devops/disaster-recovery/

# View PostgreSQL DR runbook
cat devops/disaster-recovery/postgres-failover.md
```

### RTO / RPO Targets

| Component | RTO | RPO | Method |
|-----------|-----|-----|--------|
| PostgreSQL | < 15 min | < 1 hr | WAL streaming + snapshots |
| Kafka | < 5 min | < 5 min | Multi-broker + offset backup |
| Redis | < 2 min | < 1 min | Redis Sentinel + AOF |
| S3/MinIO | < 1 min | < 1 min | Cross-region replication |
| Neo4j | < 30 min | < 4 hr | Causal clustering + snapshots |
| Full Platform | < 1 hr | < 4 hr | K8s cluster restore |

### Triggering a Failover Test

```python
from devops.disaster_recovery import DRService

dr = DRService()

# Test PostgreSQL failover
result = dr.test_failover(
    component="postgres",
    target_region="us-west-2",
    dry_run=True   # Set False to execute real failover
)
print(f"Failover time: {result.failover_seconds}s")
print(f"Data loss: {result.data_loss_seconds}s worth")
print(f"RTO met: {result.rto_met}")
print(f"RPO met: {result.rpo_met}")
```

---

## Cache Management (Phase 28)

```yaml
# devops/cache/redis-cluster.yaml
cluster:
  nodes: 6  # 3 primary + 3 replica
  replicas_per_primary: 1
  max_memory: 8Gi
  eviction_policy: allkeys-lru

policies:
  - prefix: "session:"
    ttl: 3600       # 1 hour
    compression: false
  - prefix: "api-response:"
    ttl: 300        # 5 minutes
    compression: true
  - prefix: "kg-query:"
    ttl: 60         # 1 minute
    compression: true
```

---

## Performance Benchmarking (Phase 37)

```bash
# Run load test
python -m pytest devops/performance/ -v -k "load"

# Run stress test
python -m pytest devops/performance/ -v -k "stress"

# Run soak test (long-running)
python -m pytest devops/performance/ -v -k "soak" --timeout=3600
```

### Benchmark Targets

| Benchmark | Target | SLO |
|-----------|--------|-----|
| API Gateway throughput | 10,000 RPS | P99 < 200ms |
| Code completion | — | P99 < 2s |
| Knowledge graph query | — | P99 < 100ms |
| Agent dispatch | — | P50 < 300ms |
| Memory recall | — | P50 < 50ms |
| Database writes | 5,000 TPS | P99 < 50ms |
