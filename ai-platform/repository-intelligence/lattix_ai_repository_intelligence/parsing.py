from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, field

from .models import CodeSymbol, EditorLanguage, ParsedFile, ReferenceLocation, RepositorySnapshot


@dataclass(slots=True)
class ParseTreeNode:
    id: str
    kind: str
    text: str
    start_line: int
    end_line: int
    start_column: int
    end_column: int
    children: list["ParseTreeNode"] = field(default_factory=list)


def detect_language(path: str) -> EditorLanguage:
    if path.endswith(".tsx"):
        return "tsx"
    if path.endswith(".ts"):
        return "typescript"
    if path.endswith(".jsx"):
        return "jsx"
    if path.endswith(".js"):
        return "javascript"
    if path.endswith(".json"):
        return "json"
    if path.endswith(".yaml") or path.endswith(".yml"):
        return "yaml"
    if path.endswith(".md") or path.endswith(".mdx"):
        return "markdown"
    return "plaintext"


def parse_file(snapshot: RepositorySnapshot, file_path: str) -> ParsedFile:
    file = next((item for item in snapshot.files if item.path == file_path), None)
    content = file.content if file else ""
    language = file.language if file else detect_language(file_path)
    ast = {
        "file_id": f"{snapshot.repository_id}:{file_path}",
        "revision": file.revision if file else snapshot.commit,
        "language": language,
        "root_node": _build_parse_tree(content, language),
        "errors": _collect_parse_errors(content, language),
    }
    symbols = _extract_symbols(file_path, content, language)
    imports = _extract_imports(content)
    references = _extract_references(content, symbols)
    diagnostics = _collect_file_diagnostics(file_path, content, language)
    dependencies = _infer_dependencies(file_path, imports)
    database_entities = _extract_database_entities(content)

    return ParsedFile(
        path=file_path,
        language=language,
        hash=file.hash if file else _hash_text(content),
        ast=ast,
        symbols=symbols,
        imports=imports,
        references=references,
        diagnostics=diagnostics,
        dependencies=dependencies,
        database_entities=database_entities,
    )


def _build_parse_tree(content: str, language: EditorLanguage) -> ParseTreeNode:
    lines = content.splitlines() or [""]
    root = ParseTreeNode("root", "program", "Program", 1, len(lines), 1, 1)
    for index, line in enumerate(lines, start=1):
        trimmed = line.strip()
        if not trimmed:
            continue
        if re.match(r"^(export\s+)?(async\s+)?function\s+", trimmed) or re.match(r"^(export\s+)?const\s+\w+\s*=\s*\(", trimmed):
            kind = "function"
        elif re.match(r"^(export\s+)?class\s+", trimmed):
            kind = "class"
        elif trimmed.startswith("import "):
            kind = "import"
        elif "{" in trimmed:
            kind = "block-start"
        else:
            kind = "statement"
        root.children.append(ParseTreeNode(f"{language}-{index}", kind, trimmed, index, index, 1, len(line) + 1))
    return root


def _collect_parse_errors(content: str, language: EditorLanguage) -> list[str]:
    errors = []
    if content.count("{") != content.count("}"):
        errors.append(f"Unbalanced braces detected for {language} source.")
    if "TODO(" in content:
        errors.append("TODO marker should be resolved before merge.")
    return errors


def _extract_symbols(path: str, content: str, language: EditorLanguage) -> list[CodeSymbol]:
    symbols: list[CodeSymbol] = []
    for index, line in enumerate(content.splitlines(), start=1):
        match = re.match(r"^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)", line)
        class_match = re.match(r"^(?:export\s+)?class\s+([A-Za-z0-9_]+)", line)
        const_match = re.match(r"^(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(", line)
        interface_match = re.match(r"^(?:export\s+)?interface\s+([A-Za-z0-9_]+)", line)
        type_match = re.match(r"^(?:export\s+)?type\s+([A-Za-z0-9_]+)", line)
        name = next((group for group in [match, class_match, const_match, interface_match, type_match] if group), None)
        if not name:
            continue
        symbol_name = name.group(1)
        kind = "function" if match or const_match else "class" if class_match else "interface" if interface_match else "type"
        symbols.append(
            CodeSymbol(
                name=symbol_name,
                kind=kind,  # type: ignore[arg-type]
                path=path,
                start_line=index,
                start_column=1,
                end_line=index,
                end_column=len(line) + 1,
                signature=line.strip(),
                container=_infer_package_name(path),
                language=language,
            )
        )
    return symbols


def _extract_imports(content: str) -> list[str]:
    imports = []
    for line in content.splitlines():
        match = re.match(r'^\s*import\s+.*from\s+["\']([^"\']+)["\']', line)
        bare = re.match(r'^\s*import\s+["\']([^"\']+)["\']', line)
        if match:
            imports.append(match.group(1))
        elif bare:
            imports.append(bare.group(1))
    return imports


def _extract_references(content: str, symbols: list[CodeSymbol]) -> list[ReferenceLocation]:
    references: list[ReferenceLocation] = []
    for line_number, line in enumerate(content.splitlines(), start=1):
        for symbol in symbols:
            column = line.find(symbol.name)
            if column != -1:
                references.append(ReferenceLocation(symbol.path, line_number, column + 1, line.strip()))
    return references


def _collect_file_diagnostics(path: str, content: str, language: EditorLanguage) -> list[dict]:
    diagnostics = [
        {
            "severity": "warning",
            "message": message,
            "source": "repository-intelligence",
            "path": path,
            "range": {"startLine": i + 1, "startColumn": 1, "endLine": i + 1, "endColumn": 1},
            "code": "parse-warning",
        }
        for i, message in enumerate(_collect_parse_errors(content, language))
    ]
    if len(content) > 10_000:
        diagnostics.append(
            {
                "severity": "warning",
                "message": "File is large and should be indexed incrementally.",
                "source": "repository-intelligence",
                "path": path,
                "range": {"startLine": 1, "startColumn": 1, "endLine": 1, "endColumn": 1},
                "code": "large-file",
            }
        )
    return diagnostics


def _infer_dependencies(path: str, imports: list[str]) -> list[str]:
    dependencies = []
    for item in imports:
        if item.startswith("@/"):
            dependencies.append(item)
        elif item.startswith("."):
            dependencies.append(f"{_infer_package_name(path)}:{item}")
        else:
            dependencies.append(f"npm:{item}")
    return dependencies


def _extract_database_entities(content: str) -> list[str]:
    entities: list[str] = []
    for line in content.splitlines():
        for pattern in [r"create\s+table\s+([A-Za-z0-9_]+)", r"insert\s+into\s+([A-Za-z0-9_]+)", r"from\s+([A-Za-z0-9_]+)"]:
            match = re.search(pattern, line, re.I)
            if match:
                entities.append(match.group(1))
    return sorted(set(entities))


def _infer_package_name(path: str) -> str:
    if path.startswith("frontend/apps/web/"):
        return "@lattix/web"
    if path.startswith("shared/"):
        return "@lattix/shared"
    if path.startswith("services/"):
        return "@lattix/services"
    return path.split("/", 1)[0]


def _hash_text(content: str) -> str:
    return hashlib.sha1(content.encode("utf-8")).hexdigest()[:12]
