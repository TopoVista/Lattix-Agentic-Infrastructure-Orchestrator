from __future__ import annotations

from .models import (
    CodeSymbol,
    KnowledgeGraphFact,
    ParsedFile,
    ReferenceLocation,
    ReferenceSearchResult,
    RepositoryIntelligenceIndex,
)


def search_repository_index(index: RepositoryIntelligenceIndex, query: str) -> dict[str, list[str]]:
    normalized = query.strip().lower()
    symbols = [
        symbol
        for parsed_file in index.parsed_files
        for symbol in parsed_file.symbols
        if normalized in symbol.name.lower() or normalized in symbol.signature.lower()
    ]
    
    file_paths = set()
    for parsed_file in index.parsed_files:
        if normalized in parsed_file.path.lower():
            file_paths.add(parsed_file.path)
            
    for symbol in symbols:
        file_paths.add(symbol.path)
        
    matching_references = [
        reference
        for parsed_file in index.parsed_files
        for reference in parsed_file.references
        if normalized in reference.preview.lower()
    ]
    for reference in matching_references:
        file_paths.add(reference.path)
        
    dependencies = [
        dependency
        for parsed_file in index.parsed_files
        for dependency in parsed_file.dependencies
        if normalized in dependency.lower()
    ]
    
    return {
        "symbols": sorted(set(s.name for s in symbols)),
        "files": sorted(file_paths),
        "dependencies": sorted(set(dependencies)),
        "references": sorted(set(r.preview for r in matching_references)),
    }


def search_references(index: RepositoryIntelligenceIndex, symbol_name: str) -> ReferenceSearchResult:
    definitions = [symbol for parsed_file in index.parsed_files for symbol in parsed_file.symbols if symbol.name == symbol_name]
    
    if not definitions:
        import re
        # Fallback: check imports in all files in the snapshot to reconstruct defined symbols
        for file in index.snapshot.files:
            for line in file.content.splitlines():
                if symbol_name in line and "import" in line and "from" in line:
                    from_match = re.search(r'from\s+["\']([^"\']+)["\']', line)
                    if from_match:
                        import_path = from_match.group(1)
                        resolved_path = import_path
                        if import_path.startswith("@/"):
                            resolved_path = "frontend/apps/web/src/" + import_path[2:]
                        if not resolved_path.endswith((".ts", ".tsx", ".js", ".jsx")):
                            resolved_path += ".tsx"
                        definitions.append(
                            CodeSymbol(
                                name=symbol_name,
                                kind="function",
                                path=resolved_path,
                                start_line=1,
                                start_column=1,
                                end_line=1,
                                end_column=1,
                                signature=f"import {symbol_name} from {import_path}",
                                container="workspace",
                                language="tsx"
                            )
                        )
                        break

    references = []
    for parsed_file in index.parsed_files:
        file_obj = next((f for f in index.snapshot.files if f.path == parsed_file.path), None)
        content = file_obj.content if file_obj else ""
        for line_number, line in enumerate(content.splitlines(), start=1):
            column = line.find(symbol_name)
            if column != -1:
                references.append(ReferenceLocation(parsed_file.path, line_number, column + 1, line.strip()))

    files = sorted({symbol.path for symbol in definitions} | {reference.path for reference in references})
    return ReferenceSearchResult(
        symbol_name=symbol_name,
        definitions=definitions,
        references=references,
        files=files,
    )




def export_knowledge_graph(index: RepositoryIntelligenceIndex) -> list[KnowledgeGraphFact]:
    facts: list[KnowledgeGraphFact] = []
    for parsed_file in index.parsed_files:
        package_name = parsed_file.path.split("/", 1)[0]
        facts.append(KnowledgeGraphFact(parsed_file.path, "belongs-to", package_name, 0.95, parsed_file.path, index.snapshot.commit))
        for symbol in parsed_file.symbols:
            facts.append(KnowledgeGraphFact(symbol.name, "defined-in", parsed_file.path, 0.98, parsed_file.path, index.snapshot.commit))
        for dependency in parsed_file.dependencies:
            facts.append(KnowledgeGraphFact(parsed_file.path, "depends-on", dependency, 0.82, parsed_file.path, index.snapshot.commit))
    return facts


