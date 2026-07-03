# Knowledge Graph

## Purpose

Contains Neo4j graph schemas, importers, query APIs, evidence bundles, and graph-based impact analysis.

## Owner Type

Data platform and AI platform.

## Conventions

- Python packages use `lattix_knowledge_graph`.
- Graph facts must include provenance, freshness, confidence, and source references.
- Graph ingestion should be idempotent.
- Avoid storing raw secrets or unnecessary personal data in graph properties.

## Future Phase Dependencies

- Phase 12 exports repository intelligence facts.
- Phase 14 implements the knowledge graph.
- Phase 27 extends graph facts into the digital twin.
