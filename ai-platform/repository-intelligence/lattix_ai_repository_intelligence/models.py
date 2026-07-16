from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

EditorLanguage = Literal["typescript", "tsx", "javascript", "jsx", "json", "yaml", "markdown", "plaintext"]
GraphKind = Literal["function", "class", "file", "package", "module", "route", "table", "service", "database", "field", "variable", "statement"]
IndexJobStatus = Literal["queued", "ingesting", "parsing", "building_graphs", "indexed", "cancelled", "failed"]
IndexJobEventType = Literal["created", "started", "progress", "completed", "failed", "cancelled", "retried"]


@dataclass(slots=True)
class CodeSymbol:
    name: str
    kind: Literal["function", "class", "interface", "type", "variable", "method"]
    path: str
    start_line: int
    start_column: int
    end_line: int
    end_column: int
    signature: str
    container: str
    language: EditorLanguage


@dataclass(slots=True)
class ReferenceLocation:
    path: str
    line: int
    column: int
    preview: str


@dataclass(slots=True)
class GraphNode:
    id: str
    label: str
    kind: GraphKind


@dataclass(slots=True)
class GraphEdge:
    source: str
    target: str
    label: str


@dataclass(slots=True)
class CodeGraph:
    name: str
    nodes: list[GraphNode]
    edges: list[GraphEdge]


@dataclass(slots=True)
class RepositoryGraphBundle:
    repository_id: str
    commit: str
    graphs: dict[str, CodeGraph]


@dataclass(slots=True)
class RepositoryFile:
    path: str
    content: str
    language: EditorLanguage
    revision: str
    hash: str


@dataclass(slots=True)
class RepositorySnapshot:
    repository_id: str
    branch: str
    commit: str
    object_ref: str
    created_at: str
    files: list[RepositoryFile]


@dataclass(slots=True)
class ParsedFile:
    path: str
    language: EditorLanguage
    hash: str
    ast: dict
    symbols: list[CodeSymbol]
    imports: list[str]
    references: list[ReferenceLocation]
    diagnostics: list[dict]
    dependencies: list[str]
    database_entities: list[str]


@dataclass(slots=True)
class IndexJobEvent:
    id: str
    type: IndexJobEventType
    message: str
    progress: int
    created_at: str


@dataclass(slots=True)
class IndexJob:
    id: str
    workspace_id: str
    repository_id: str
    branch: str
    commit: str
    status: IndexJobStatus
    progress: int
    retry_count: int = 0
    cancelled: bool = False
    errors: list[str] = field(default_factory=list)
    events: list[IndexJobEvent] = field(default_factory=list)


@dataclass(slots=True)
class RepositoryIntelligenceIndex:
    snapshot: RepositorySnapshot
    job: IndexJob
    parsed_files: list[ParsedFile]
    graphs: RepositoryGraphBundle
    updated_at: str


@dataclass(slots=True)
class KnowledgeGraphFact:
    subject: str
    predicate: str
    object: str
    confidence: float
    source_path: str
    commit: str


@dataclass(slots=True)
class IndexJobRequest:
    workspace_id: str
    repository_id: str
    branch: str
    commit: str
    priority: Literal["low", "normal", "high"] = "normal"


@dataclass(slots=True)
class ReferenceSearchRequest:
    workspace_id: str
    repository_id: str
    symbol_name: str
    path: str | None = None


@dataclass(slots=True)
class ReferenceSearchResult:
    symbol_name: str
    definitions: list[CodeSymbol]
    references: list[ReferenceLocation]
    files: list[str]

    def __getitem__(self, item):
        return getattr(self, item)



