# Digital Twin — Developer Guide

> A living, continuously updated model of code, infrastructure, data flows, costs, incidents, and decisions.

## Overview (Phase 27)

The Digital Twin is a queryable, graph-backed representation of the entire engineering system. It is updated in real-time from git commits, deployment events, infrastructure changes, incident reports, and cost data.

## What the Twin Models

```
Digital Twin
├── Code Layer
│   ├── Services and their versions
│   ├── APIs and contracts
│   └── Dependencies and call graphs
│
├── Infrastructure Layer
│   ├── Kubernetes clusters and namespaces
│   ├── Cloud resources (RDS, ElastiCache, MSK, S3)
│   └── Network topology and security groups
│
├── Data Layer
│   ├── Kafka topics and consumer groups
│   ├── Database schemas and row counts
│   └── Feature stores and model artifacts
│
├── Cost Layer
│   ├── Per-resource monthly cost
│   ├── Cost trend and forecast
│   └── Rightsizing recommendations
│
├── Incident Layer
│   ├── All past incidents with resolution paths
│   ├── MTTR per service
│   └── Failure modes and blast radius
│
└── Decision Layer
    ├── Architecture Decision Records (ADRs)
    ├── Linked to affected code and services
    └── Decision outcome tracking
```

## Python Usage

```python
from digital_twin import DigitalTwinService

twin = DigitalTwinService()

# Query system topology
topology = twin.get_topology()
for node in topology.nodes:
    print(f"{node.name} ({node.type}) - {node.status}")

# Get service dependencies
deps = twin.get_dependencies("auth-service")
print(f"auth-service depends on: {[d.name for d in deps.upstream]}")
print(f"auth-service is used by: {[d.name for d in deps.downstream]}")

# Cost model
costs = twin.get_cost_model()
print(f"Total monthly: ${costs.total_monthly:,.0f}")
print(f"Biggest cost: {costs.top_resource.name} (${costs.top_resource.cost:,.0f}/mo)")
print(f"Potential savings: ${costs.total_savings:,.0f}/mo")

# Impact analysis — what breaks if service X goes down?
impact = twin.analyze_impact("postgres")
print(f"Services affected: {[s.name for s in impact.affected_services]}")
print(f"Data loss risk: {impact.data_loss_risk}")
print(f"Estimated recovery time: {impact.estimated_rto}")

# Query incident history for a service
incidents = twin.get_incidents(service="kafka", severity=["P1","P2"])
for inc in incidents:
    print(f"{inc.id}: {inc.title} ({inc.status}) - resolved by {inc.resolved_by}")
```

## Sync Events

The twin updates automatically when these events are published on Kafka:

| Kafka Topic | Trigger | Twin Update |
|------------|---------|------------|
| `lattix.infra.deployment.v1` | New deployment | Updates service version + status |
| `lattix.incident.created.v1` | Alert fires | Adds incident node + edges |
| `lattix.incident.resolved.v1` | Alert clears | Updates incident status |
| `lattix.cost.report.v1` | Cost data | Updates cost layer |
| `lattix.git.push.v1` | Git push | Updates code layer |

## Running Tests

```bash
python -m pytest tests/test_digital_twin.py -v
```

## UI Access

View the Digital Twin at: **http://localhost:3001/platform/digital-twin**

Three views:
1. **System Topology** — Click any service/data node to see details and dependencies
2. **Cost Model** — Resource-by-resource cost breakdown with optimization suggestions  
3. **Incident History** — Past incidents with severity, duration, and resolution path
