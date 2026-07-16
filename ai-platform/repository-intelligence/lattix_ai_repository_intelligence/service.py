from __future__ import annotations

from dataclasses import replace
from datetime import datetime, timezone

from .graphs import build_repository_graph_bundle
from .models import (
    IndexJob,
    IndexJobEvent,
    IndexJobRequest,
    ParsedFile,
    ReferenceSearchRequest,
    ReferenceSearchResult,
    RepositoryFile,
    RepositoryIntelligenceIndex,
    RepositorySnapshot,
)
from .parsing import detect_language, parse_file
from .search import export_knowledge_graph as _export_knowledge_graph
from .search import search_references as _search_references
from .search import search_repository_index as _search_repository_index


_INDEX_REGISTRY: dict[tuple[str, str], RepositoryIntelligenceIndex] = {}


def register_index(index: RepositoryIntelligenceIndex) -> None:
    _INDEX_REGISTRY[(index.job.workspace_id, index.job.repository_id)] = index


def get_registered_index(workspace_id: str, repository_id: str) -> RepositoryIntelligenceIndex | None:
    return _INDEX_REGISTRY.get((workspace_id, repository_id))



def create_index_job(
    workspace_id_or_request: str | IndexJobRequest,
    repository_id: str | None = None,
    branch: str | None = None,
    commit: str | None = None,
) -> IndexJob:
    if isinstance(workspace_id_or_request, IndexJobRequest):
        workspace_id = workspace_id_or_request.workspace_id
        repository_id = workspace_id_or_request.repository_id
        branch = workspace_id_or_request.branch
        commit = workspace_id_or_request.commit
    else:
        workspace_id = workspace_id_or_request

    now = _now()
    return IndexJob(
        id=f"index-job-{repository_id}-{commit}",
        workspace_id=workspace_id,
        repository_id=repository_id,
        branch=branch,
        commit=commit,
        status="queued",
        progress=0,
        events=[
            IndexJobEvent(
                id=f"{repository_id}-created",
                type="created",
                message=f"Queued repository index for {repository_id}",
                progress=0,
                created_at=now,
            )
        ],
    )



def start_index_job(job: IndexJob) -> IndexJob:
    return _append_event(job, "started", f"Started indexing {job.repository_id}", 5, status="ingesting", cancelled=False)


def advance_index_job(job: IndexJob, status: str, progress: int, message: str) -> IndexJob:
    return _append_event(job, "progress", message, progress, status=status)


def complete_index_job(job: IndexJob) -> IndexJob:
    return _append_event(job, "completed", f"Finished indexing {job.repository_id}", 100, status="indexed")


def cancel_index_job(job: IndexJob, message: str = "Repository index cancelled") -> IndexJob:
    return _append_event(job, "cancelled", message, job.progress, status="cancelled", cancelled=True)


def retry_index_job(job: IndexJob, reason: str) -> IndexJob:
    return replace(
        job,
        status="queued",
        progress=0,
        retry_count=job.retry_count + 1,
        cancelled=False,
        errors=job.errors + [reason],
        events=job.events
        + [
            IndexJobEvent(
                id=f"{job.id}-retry-{job.retry_count + 1}",
                type="retried",
                message=reason,
                progress=0,
                created_at=_now(),
            )
        ],
    )


def create_repository_snapshot(repository_id: str, branch: str = "main", commit: str = "fixture", files: dict[str, str] | None = None) -> RepositorySnapshot:
    files = files or {}
    repo_files = [
        RepositoryFile(path=path, content=content, language=detect_language(path), revision=commit, hash=_hash_text(content))
        for path, content in sorted(files.items())
    ]
    return RepositorySnapshot(repository_id, branch, commit, f"{repository_id}:{branch}:{commit}", _now(), repo_files)


def ingest_repository_snapshot(snapshot: RepositorySnapshot, job: IndexJob | None = None) -> RepositoryIntelligenceIndex:
    job = start_index_job(job or create_index_job("ws-lattix", snapshot.repository_id, snapshot.branch, snapshot.commit))
    job = advance_index_job(job, "parsing", 45, "Parsing repository files")
    parsed_files = [parse_file(snapshot, file.path) for file in snapshot.files]
    job = advance_index_job(job, "building_graphs", 80, "Building repository graphs")
    job = complete_index_job(job)
    graphs = build_repository_graph_bundle(snapshot, parsed_files)
    index = RepositoryIntelligenceIndex(snapshot, job, parsed_files, graphs, _now())
    register_index(index)
    return index


def search_repository_index(index: RepositoryIntelligenceIndex, query: str) -> dict[str, list[str]]:
    return _search_repository_index(index, query)


def search_references(
    index_or_request: RepositoryIntelligenceIndex | ReferenceSearchRequest,
    symbol_name: str | None = None,
) -> ReferenceSearchResult | dict[str, list]:
    if isinstance(index_or_request, ReferenceSearchRequest):
        index = get_registered_index(index_or_request.workspace_id, index_or_request.repository_id)
        if not index:
            raise ValueError(f"No index found for workspace {index_or_request.workspace_id} and repository {index_or_request.repository_id}")
        symbol_name = index_or_request.symbol_name
    else:
        index = index_or_request
    return _search_references(index, symbol_name)


def export_knowledge_graph(index: RepositoryIntelligenceIndex):
    return _export_knowledge_graph(index)



def _append_event(job: IndexJob, event_type: str, message: str, progress: int, **changes) -> IndexJob:
    event = IndexJobEvent(f"{job.id}-{event_type}-{len(job.events) + 1}", event_type, message, progress, _now())
    return replace(job, progress=progress, events=job.events + [event], **changes)


def _hash_text(content: str) -> str:
    import hashlib

    return hashlib.sha1(content.encode("utf-8")).hexdigest()[:12]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()
