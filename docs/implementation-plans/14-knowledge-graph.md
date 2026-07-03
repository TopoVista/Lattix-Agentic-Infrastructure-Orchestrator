# Phase 14 - Knowledge Graph

## Goal

Create the Lattix knowledge graph so code, people, commits, deployments, incidents, requirements, infrastructure, metrics, logs, alerts, and decisions become connected, queryable knowledge.

## Why This Phase Exists

The knowledge graph is the platform's long-term reasoning substrate. It lets Lattix answer questions that require relationships across systems, such as which team owns an API, which deployment caused an incident, which services depend on a database, or which decision explains an architecture tradeoff.

## Success Criteria

- Neo4j graph schema is defined.
- Ingestion pipelines exist for repositories, users, workspaces, commits, deployments, incidents, requirements, infrastructure, metrics, logs, alerts, and ADRs.
- Graph query API supports neighborhood search, impact analysis, ownership lookup, and timeline queries.
- Graph data has provenance and freshness metadata.

## Deliverables

- Graph schema.
- Ingestion workers.
- Graph query service.
- Provenance model.
- Index and constraint definitions.
- Initial graph dashboards or query examples.

## Folder Structure

```text
knowledge-graph/
  schemas/
  ingest/
    code/
    people/
    infra/
    incidents/
    docs/
    observability/
  query-api/
  cypher/
  tests/
```

## Modules To Build

- Schema module for nodes, relationships, indexes, and constraints.
- Code ingestion module.
- People and ownership ingestion module.
- Infrastructure ingestion module.
- Incident and deployment ingestion module.
- Documentation and requirement ingestion module.
- Observability ingestion module.
- Query API module.

## Functionality

- Represent repositories, packages, files, classes, functions, APIs, databases, services, users, teams, commits, PRs, deployments, cloud resources, incidents, alerts, logs, metrics, requirements, meetings, emails, and ADRs.
- Preserve relationship types such as owns, calls, depends_on, deploys_to, changed_by, caused, mitigated_by, documented_by, discussed_in, and violates.
- Answer impact, ownership, dependency, lineage, and timeline questions.
- Export graph neighborhoods to AI context builders.

## Tech Stack

- Neo4j.
- Cypher.
- Spring Boot or FastAPI query service.
- Kafka consumers for ingestion.
- Repository intelligence exporters.
- OpenTelemetry.

## Implementation Plan

1. Define graph ontology with node labels, relationship types, required properties, and indexes.
2. Implement graph write adapter with idempotent upserts.
3. Ingest repository intelligence nodes and edges.
4. Ingest user, team, workspace, and ownership data.
5. Ingest deployment, infrastructure, incident, and alert data from events.
6. Ingest ADRs, requirements, and docs metadata.
7. Implement query APIs for impact analysis, dependency paths, ownership, timelines, and evidence bundles.
8. Add graph freshness and provenance tracking.
9. Add tests for schema constraints and representative queries.

## Functions / Classes / Interfaces To Implement

```python
def upsert_node(node: KnowledgeNode) -> KnowledgeNodeRef:
    # Creates or updates a graph node by stable external id and provenance metadata.

def upsert_relationship(edge: KnowledgeEdge) -> KnowledgeEdgeRef:
    # Creates or updates a typed relationship with source, target, confidence, and source event.

def find_impact_radius(request: ImpactAnalysisRequest) -> ImpactGraph:
    # Returns affected services, APIs, owners, deployments, and risks for a changed node.

def get_evidence_bundle(request: EvidenceBundleRequest) -> EvidenceBundle:
    # Collects related graph facts with provenance for AI answers and audits.

def query_ownership(resource_id: str) -> OwnershipResult:
    # Resolves owning team, maintainers, recent contributors, and escalation path.
```

## Configuration / Environment Variables

- `NEO4J_URI`
- `NEO4J_USERNAME`
- `NEO4J_PASSWORD`
- `KNOWLEDGE_GRAPH_BATCH_SIZE`
- `KNOWLEDGE_GRAPH_WRITE_CONCURRENCY`
- `KNOWLEDGE_GRAPH_STALENESS_WARNING_HOURS`

## Data Models / Schemas / Contracts

- `KnowledgeNode`: id, label, externalId, properties, provenance, updatedAt.
- `KnowledgeEdge`: id, type, sourceId, targetId, properties, confidence, provenance.
- `Provenance`: sourceSystem, sourceEventId, observedAt, ingestedAt, confidence.
- `ImpactGraph`: root, nodes, edges, riskSummary, evidence.
- `EvidenceBundle`: facts, sources, graphPaths, freshness, confidence.

## Testing Plan

- Schema constraint tests.
- Idempotent ingestion tests.
- Query tests for known graph fixtures.
- Provenance and freshness tests.
- Performance tests for neighborhood queries on large synthetic graphs.

## Acceptance Criteria

- Core entities and relationships are queryable in Neo4j.
- Graph facts include source and freshness.
- AI and digital twin phases can request evidence bundles.
- Impact and ownership queries work on representative data.

## Risks And Mitigations

- Risk: graph becomes a dumping ground. Mitigation: enforce ontology, provenance, and ownership.
- Risk: stale facts mislead AI. Mitigation: freshness timestamps and confidence scoring.
- Risk: graph queries get slow. Mitigation: indexes, bounded traversals, and query profiling.

## Next Phase Handoff

Phase 15 should combine knowledge graph facts with working, semantic, long-term, procedural, and organizational memory.
