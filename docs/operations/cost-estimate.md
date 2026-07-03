# Lattix Cost Estimate

## Purpose

This document provides an initial cost model for Lattix across local development, MVP cloud, V1 cloud, and enterprise production. It is not a vendor quote. It is a planning baseline to keep architecture choices cost-aware.

## Cost Principles

- Use local profiles so developers do not need every heavy dependency running at once.
- Prefer managed services when operational risk is higher than service cost.
- Treat observability, AI, data pipelines, and multi-region as active cost centers.
- Tag every cloud resource with project, environment, owner, workspace where applicable, and cost center.
- Add budget alerts before production workloads.
- Track unit cost by workspace, repository, agent task, chat, model, service, and environment where possible.

## Local Development Estimate

Local development primarily uses Docker Compose profiles.

| Component | Local Mode | Cost |
| --- | --- | --- |
| Frontend, gateway, services | Local processes or containers | Developer machine |
| Postgres, Redis, Kafka, MinIO | Docker Compose core profile | Developer machine |
| Neo4j, Qdrant, ClickHouse, OpenSearch | Optional profiles | Developer machine |
| Observability | Optional profile | Developer machine |
| AI model calls | External API or local model | Variable |

Expected local cash cost:

- Base development: USD 0 excluding developer hardware.
- AI API usage: variable, set per-developer budget.
- Optional cloud sandbox: USD 20 to USD 150 per month depending on services.

## MVP Cloud Estimate

MVP goal: run a staging-like environment with core workspace, auth, repository browsing, indexing, chat, agents, events, and observability.

| Cost Area | Example Resources | Monthly Planning Range |
| --- | --- | --- |
| Kubernetes | Small EKS cluster or equivalent, 2-4 nodes | USD 150-600 |
| Databases | Managed Postgres, Redis, object storage | USD 100-500 |
| Kafka | Managed Kafka or smaller self-managed dev profile | USD 100-800 |
| Search/Graph/Vector | Small OpenSearch, Neo4j, Qdrant instances | USD 150-900 |
| Observability | Metrics, logs, traces, dashboards | USD 100-600 |
| AI usage | Chat, embeddings, code proposals | USD 100-1,500 |
| Networking | NAT, load balancer, DNS, egress | USD 75-400 |
| Storage | Repository snapshots, artifacts, logs | USD 25-200 |

MVP planning total:

```text
Low:    USD 800/month
Medium: USD 2,500/month
High:   USD 5,500/month
```

## V1 Cloud Estimate

V1 goal: production-shaped environment with repository intelligence, knowledge graph, memory, MCP tools, CI/CD, observability, and digital twin basics.

| Cost Area | Main Drivers | Monthly Planning Range |
| --- | --- | --- |
| Compute | Services, agents, workers, indexers, AI services | USD 1,000-5,000 |
| Datastores | Postgres, Redis, Kafka, Neo4j, Qdrant, ClickHouse, OpenSearch | USD 2,000-12,000 |
| Observability | Logs, traces, metrics, retention, dashboards | USD 1,000-8,000 |
| AI models | Chat, code completion, embeddings, evaluations, reranking | USD 2,000-30,000 |
| CI/CD | Builds, scans, tests, artifacts, runners | USD 500-5,000 |
| Data platform | Lakehouse, Flink/Spark/Airflow, storage | USD 1,000-10,000 |
| Networking | Load balancers, NAT, CDN, egress | USD 500-5,000 |

V1 planning total:

```text
Low:    USD 8,000/month
Medium: USD 35,000/month
High:   USD 75,000/month
```

## Enterprise Production Estimate

Enterprise goal: secure, compliant, multi-region, production-ready deployment with DR, chaos, compliance, benchmarking, cost optimization, SDKs, CLI, and support.

| Cost Area | Main Drivers | Monthly Planning Range |
| --- | --- | --- |
| Multi-region compute | Active-passive or active-active clusters | USD 5,000-40,000 |
| Databases and replication | HA, replicas, backups, regional copies | USD 8,000-80,000 |
| AI and ML | High-volume chat, agents, embeddings, training, serving | USD 10,000-150,000 |
| Observability and SIEM | Retention, security logs, traces, alerts | USD 5,000-75,000 |
| Data platform | Streaming, lakehouse, analytics, feature store | USD 5,000-60,000 |
| Security and compliance | Scanning, audit storage, exports, runtime security | USD 2,000-25,000 |
| Networking and egress | CDN, global routing, NAT, inter-region transfer | USD 3,000-50,000 |
| Support tooling | Docs portal, status, incident tooling, support systems | USD 500-10,000 |

Enterprise planning total:

```text
Low:     USD 40,000/month
Medium:  USD 150,000/month
High:    USD 500,000+/month
```

## Primary Cost Drivers

- AI model calls and embeddings.
- Log and trace volume.
- OpenSearch, Neo4j, Qdrant, ClickHouse sizing.
- Kafka retention and throughput.
- Repository indexing worker compute.
- Multi-region replication.
- NAT and egress traffic.
- Long audit and compliance retention.

## Cost Controls By Phase

| Phase | Control |
| --- | --- |
| 2 | Local profiles, env management, CI budget awareness |
| 3 | Tags, budgets, right-sized dev infrastructure |
| 6 | Rate limits and quotas |
| 8 | Datastore ownership and retention |
| 12 | Indexing quotas and file size limits |
| 13 | AI request budgets and context limits |
| 20 | Dataset retention and compaction |
| 26 | Observability retention and cardinality rules |
| 28 | Caching to reduce repeated expensive reads |
| 30 | Request cost model and adaptive throttling |
| 38 | Cost optimization engine |

## Required Tags

- `Project=Lattix`
- `Environment=local|dev|staging|prod`
- `Owner=<team-or-user>`
- `CostCenter=<value>`
- `DataClass=public|internal|confidential|restricted|regulated`
- `ManagedBy=terraform|kubernetes|manual-exception`

## Budget Alerts

Initial budget thresholds:

- Development: alert at 50, 80, and 100 percent of monthly budget.
- Staging: alert at 50, 80, 100, and 120 percent.
- Production: alert at forecasted 80 percent, actual 80 percent, actual 100 percent, and daily anomaly above 20 percent.

## Acceptance Criteria

- Every cloud phase must update this estimate when introducing new managed services.
- Every heavy subsystem must expose usage metrics.
- Every production resource must be tagged.
- Cost optimization must become a first-class phase, not an afterthought.
