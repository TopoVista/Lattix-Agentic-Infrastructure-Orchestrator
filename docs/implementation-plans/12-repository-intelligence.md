# Phase 12 - Repository Intelligence

## Goal

Index repositories into structural representations that Lattix can search, reason over, visualize, and use as context for AI.

## Why This Phase Exists

Repository-aware AI requires more than raw file text. It needs ASTs, control-flow graphs, data-flow graphs, SSA-like representations, call graphs, dependency graphs, API graphs, package graphs, database graphs, and knowledge graph exports. This phase creates the code intelligence substrate.

## Success Criteria

- Repository indexing pipeline can clone or ingest repository snapshots.
- Supported languages produce AST and symbol indexes.
- Call, dependency, API, package, and database graph contracts exist.
- Indexing jobs are event-driven, observable, retryable, and resumable.
- Search APIs support symbols, references, files, dependencies, and graph queries.

## Deliverables

- Repository indexer service.
- Parser workers.
- Graph builder workers.
- Index storage model.
- Search APIs.
- Reindex and incremental update workflows.
- Repository intelligence event contracts.

## Folder Structure

```text
ai-platform/
  repository-intelligence/
    indexer/
    parsers/
    graph-builders/
    search-api/
    workers/
shared/
  code-intelligence/
knowledge-graph/
  importers/code/
```

## Modules To Build

- Repository ingestion module.
- AST extraction module.
- Symbol extraction module.
- CFG and DFG builder module.
- SSA approximation module.
- Call graph builder.
- Dependency and package graph builder.
- API and database graph builder.
- Repository search module.
- Knowledge graph exporter.

## Functionality

- Clone repositories or read snapshots from object storage.
- Parse files incrementally when commits change.
- Extract symbols, imports, exports, definitions, references, and dependencies.
- Build structural graphs by repository, branch, commit, package, and service.
- Store searchable indexes and graph edges.
- Emit indexing lifecycle events.
- Provide APIs for editor and AI context retrieval.

## Tech Stack

- FastAPI and Python for orchestration.
- Tree-sitter for parsing.
- C++20 and LLVM for high-performance analysis where needed.
- pybind11 for Python bindings.
- OpenSearch for text and symbol search.
- Neo4j for graph relationships.
- Qdrant for semantic embeddings in later phases.
- Kafka for indexing events.

## Implementation Plan

1. Define repository snapshot model and indexing job lifecycle.
2. Implement repository ingestion from Git URL or stored archive.
3. Implement language registry and parser adapters.
4. Extract AST, symbols, imports, definitions, and references for first supported languages.
5. Build call graph, dependency graph, package graph, API graph, and database graph exporters.
6. Store text and symbol indexes in OpenSearch.
7. Store graph edges in Neo4j or graph staging tables.
8. Emit indexing events and progress updates.
9. Add reindex, incremental index, cancel, and retry controls.

## Functions / Classes / Interfaces To Implement

```python
def create_index_job(request: IndexJobRequest) -> IndexJob:
    # Creates a repository indexing job with branch, commit, scope, priority, and workspace metadata.

def parse_file(snapshot: RepositorySnapshot, file_path: str) -> ParsedFile:
    # Produces AST, symbols, imports, diagnostics, and language metadata for one file.

def build_call_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    # Connects caller and callee symbols with file ranges and confidence levels.

def build_dependency_graph(parsed_files: list[ParsedFile]) -> DependencyGraph:
    # Builds package, module, import, and service dependency relationships.

def search_references(request: ReferenceSearchRequest) -> ReferenceSearchResult:
    # Returns definitions and references for a symbol across repository scope.
```

## Configuration / Environment Variables

- `REPOSITORY_INDEX_WORKER_CONCURRENCY`
- `REPOSITORY_SNAPSHOT_BUCKET`
- `OPENSEARCH_URL`
- `NEO4J_URI`
- `KAFKA_BOOTSTRAP_SERVERS`
- `TREE_SITTER_CACHE_DIR`
- `INDEX_MAX_FILE_BYTES`

## Data Models / Schemas / Contracts

- `IndexJob`: id, workspaceId, repositoryId, branch, commit, status, progress, errors.
- `RepositorySnapshot`: repositoryId, branch, commit, objectRef, createdAt.
- `ParsedFile`: path, language, astRef, symbols, imports, diagnostics, hash.
- `CodeGraph`: nodes, edges, graphType, repositoryId, commit.
- `SymbolReference`: symbolId, path, range, referenceType, confidence.

## Testing Plan

- Parser fixture tests across supported languages.
- Indexing integration test on small sample repositories.
- Graph builder tests with known call and dependency relationships.
- Search API tests for definitions, references, and symbols.
- Retry and cancellation tests for failed indexing jobs.

## Acceptance Criteria

- Repository structure can be queried without reading raw files every time.
- Index jobs are observable and restartable.
- Editor features from phase 11 can use real search and graph APIs.
- AI phases can retrieve code context by symbol, path, graph neighborhood, and commit.

## Risks And Mitigations

- Risk: language support becomes shallow. Mitigation: start with limited languages and define adapter contracts.
- Risk: graphs are inaccurate. Mitigation: store confidence and source ranges, then improve incrementally.
- Risk: indexing large repos is slow. Mitigation: incremental hashing, worker pools, and file size limits.

## Next Phase Handoff

Phase 13 should use repository intelligence APIs to power repository-aware code completion and generation.
