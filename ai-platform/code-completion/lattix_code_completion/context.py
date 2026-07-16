from __future__ import annotations

from lattix_ai_repository_intelligence import get_registered_index
from .models import CompletionContext, CompletionRequest


def build_completion_context(request: CompletionRequest) -> CompletionContext:
    index = get_registered_index(request.workspace_id, request.repository_id)
    if not index:
        return CompletionContext()

    files_context = []
    target_file = next((f for f in index.snapshot.files if f.path == request.path), None)
    if target_file:
        files_context.append({"path": target_file.path, "content": target_file.content})

    symbols_context = []
    parsed_file = next((pf for pf in index.parsed_files if pf.path == request.path), None)
    if parsed_file:
        for s in parsed_file.symbols:
            symbols_context.append({
                "name": s.name,
                "kind": s.kind,
                "path": s.path,
                "signature": s.signature,
            })

    graph_neighbors = []
    call_graph = index.graphs.graphs.get("call")
    if call_graph:
        for edge in call_graph.edges:
            for s in symbols_context:
                symbol_id = f"symbol:{request.path}:{s['name']}"
                if edge.source == symbol_id or edge.target == symbol_id:
                    graph_neighbors.append({
                        "source": edge.source,
                        "target": edge.target,
                        "label": edge.label
                    })

    api_contracts = []
    api_graph = index.graphs.graphs.get("api")
    if api_graph:
        for node in api_graph.nodes:
            if node.kind == "route":
                api_contracts.append({
                    "id": node.id,
                    "label": node.label,
                    "kind": node.kind
                })

    schemas = []
    db_graph = index.graphs.graphs.get("database")
    if db_graph:
        for node in db_graph.nodes:
            if node.kind == "table":
                schemas.append({
                    "id": node.id,
                    "label": node.label,
                    "kind": node.kind
                })

    tests = [
        f.path for f in index.snapshot.files
        if "test" in f.path.lower() or f.path.endswith(("_test.py", "test_*.py", ".test.ts", ".spec.ts"))
    ]

    style_examples = []
    target_dir = request.path.rsplit("/", 1)[0] if "/" in request.path else ""
    for f in index.snapshot.files:
        if f.path != request.path and f.path.startswith(target_dir):
            style_examples.append(f.path)

    return CompletionContext(
        files=files_context,
        symbols=symbols_context,
        graph_neighbors=graph_neighbors,
        api_contracts=api_contracts,
        schemas=schemas,
        tests=tests,
        style_examples=style_examples[:5],
    )
