# Phase 27 - Digital Twin

## Goal

Build the Lattix digital twin: a living model of the codebase, infrastructure, databases, cloud resources, APIs, deployments, costs, incidents, metrics, logs, knowledge graph, documentation, meetings, calendars, emails, and human decisions.

## Why This Phase Exists

The digital twin is the crown jewel of Lattix. It lets the platform answer "what will happen if" questions by combining graph knowledge, observability, cost data, deployment history, code structure, and organizational memory.

## Success Criteria

- Digital twin model has entities, relationships, time, versions, and confidence.
- Twin ingests from repository intelligence, knowledge graph, cloud controllers, observability, CI/CD, memory, data platform, and external tools.
- Simulation APIs answer service split, cost migration, DTO rename, and deployment strategy questions.
- Twin outputs include assumptions, evidence, confidence, and recommended validations.

## Deliverables

- Digital twin service.
- Twin entity model.
- Ingestion adapters.
- Simulation engine.
- Scenario API.
- Impact and cost analysis workflows.
- Evidence and confidence reporting.

## Folder Structure

```text
digital-twin/
  service/
  model/
  ingestion/
  simulation/
  scenarios/
  impact-analysis/
  cost-analysis/
  deployment-analysis/
  evidence/
```

## Modules To Build

- Twin model module.
- Ingestion module.
- State versioning module.
- Simulation module.
- Impact analysis module.
- Cost analysis module.
- Deployment strategy module.
- Evidence module.

## Functionality

- Maintain current and historical twin state.
- Represent code, APIs, services, databases, infrastructure, deployments, metrics, logs, costs, incidents, docs, meetings, and decisions.
- Simulate service splits, cloud migrations, API changes, DTO renames, scaling changes, and deployment strategies.
- Compute blast radius, cost impact, reliability impact, dependency impact, and rollback complexity.
- Provide evidence-backed answers through chat and dashboards.

## Tech Stack

- Neo4j for graph state.
- ClickHouse for time-series analytics and historical aggregates.
- PostgreSQL for scenario metadata.
- Qdrant for semantic evidence.
- FastAPI or Spring Boot for scenario APIs.
- Kafka for ingestion.
- ML platform predictions where useful.

## Implementation Plan

1. Define twin entity and relationship model building on knowledge graph ontology.
2. Implement ingestion adapters from code intelligence, cloud, CI/CD, observability, memory, and tools.
3. Implement versioned twin snapshots and time-window queries.
4. Implement scenario request model with assumptions and constraints.
5. Implement impact analysis for code/API/database/deployment changes.
6. Implement cost analysis using cloud resource inventory and pricing metadata.
7. Implement deployment strategy recommendation using service health, history, risk, and rollout options.
8. Implement evidence bundle and confidence scoring.
9. Integrate scenario answers into chat pipeline.

## Functions / Classes / Interfaces To Implement

```python
def update_twin_state(event: TwinIngestionEvent) -> TwinUpdateResult:
    # Applies source events to the current twin with provenance, version, and confidence metadata.

def create_scenario(request: ScenarioRequest) -> Scenario:
    # Records a what-if question, assumptions, target entities, constraints, and requested analyses.

def simulate_service_split(request: ServiceSplitScenario) -> SimulationResult:
    # Estimates dependency, API, database, deployment, team, cost, and risk impact of splitting a service.

def simulate_dto_rename(request: DtoRenameScenario) -> SimulationResult:
    # Identifies APIs, clients, tests, docs, events, and deployments affected by a DTO rename.

def estimate_cloud_migration_cost(request: CloudMigrationScenario) -> CostSimulationResult:
    # Compares current and target cloud architecture cost using resource inventory and usage history.

def recommend_deployment_strategy(request: DeploymentScenario) -> DeploymentRecommendation:
    # Suggests safest rollout strategy based on risk, history, traffic, SLOs, and rollback path.
```

## Configuration / Environment Variables

- `DIGITAL_TWIN_API_PORT`
- `DIGITAL_TWIN_STATE_STORE`
- `DIGITAL_TWIN_SNAPSHOT_INTERVAL_MINUTES`
- `DIGITAL_TWIN_MAX_SCENARIO_DEPTH`
- `CLOUD_PRICING_SOURCE`
- `DIGITAL_TWIN_MIN_CONFIDENCE`

## Data Models / Schemas / Contracts

- `TwinEntity`: id, type, name, properties, provenance, confidence, validFrom, validTo.
- `TwinRelationship`: source, target, type, properties, confidence, validFrom, validTo.
- `ScenarioRequest`: question, actor, workspaceId, targetEntities, assumptions, constraints.
- `SimulationResult`: answer, impacts, risks, cost, confidence, evidence, recommendedValidations.
- `DeploymentRecommendation`: strategy, reasons, requiredChecks, rollbackPlan, confidence.

## Testing Plan

- Ingestion tests for each source event type.
- Scenario fixture tests for service split, DTO rename, cost migration, and deployment strategy.
- Evidence and confidence tests.
- Time-window state tests.
- Performance tests for bounded graph traversals.

## Acceptance Criteria

- Twin can answer representative what-if questions with evidence.
- Scenario results include assumptions and confidence.
- Historical state can be queried for a time window.
- Chat and agents can consume twin scenario APIs.

## Risks And Mitigations

- Risk: twin state is incomplete. Mitigation: evidence, confidence, freshness, and recommended validations.
- Risk: simulations are overtrusted. Mitigation: disclose assumptions and require human review for high-risk decisions.
- Risk: graph traversals become expensive. Mitigation: bounded traversals, materialized summaries, and caching.

## Next Phase Handoff

Phase 28 should harden caching so high-read graph, chat, gateway, and twin workloads can scale.
