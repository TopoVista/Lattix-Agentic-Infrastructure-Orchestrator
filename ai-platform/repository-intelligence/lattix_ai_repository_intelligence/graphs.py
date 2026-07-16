from __future__ import annotations

from collections import defaultdict

from .models import CodeGraph, GraphEdge, GraphNode, ParsedFile, RepositoryGraphBundle, RepositorySnapshot


def build_ast_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    for parsed_file in parsed_files:
        file_id = f"file:{parsed_file.path}"
        nodes.append(GraphNode(file_id, parsed_file.path.rsplit("/", 1)[-1], "file"))
        _walk_ast_graph(parsed_file.ast["root_node"], parsed_file.path, file_id, nodes, edges)
    return CodeGraph("ast", nodes, edges)


def build_control_flow_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    for parsed_file in parsed_files:
        previous = f"cfg-entry:{parsed_file.path}"
        nodes.append(GraphNode(previous, "entry", "statement"))
        statements = [node for node in parsed_file.ast["root_node"].children if node.kind != "import"]
        for index, statement in enumerate(statements, start=1):
            node_id = f"cfg:{parsed_file.path}:{index}"
            nodes.append(GraphNode(node_id, statement.text[:40], "statement"))
            edges.append(GraphEdge(previous, node_id, "next"))
            previous = node_id
        exit_id = f"cfg-exit:{parsed_file.path}"
        nodes.append(GraphNode(exit_id, "exit", "statement"))
        edges.append(GraphEdge(previous, exit_id, "next"))
    return CodeGraph("cfg", nodes, edges)


def build_data_flow_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    for parsed_file in parsed_files:
        assignments = _extract_assignments(parsed_file)
        for assignment in assignments:
            source = f"dfg:{parsed_file.path}:{assignment['name']}"
            nodes.append(GraphNode(source, f"{assignment['name']} = {assignment['value']}", "variable"))
            for index, use in enumerate(assignment["uses"], start=1):
                target = f"dfg-use:{parsed_file.path}:{assignment['name']}:{index}"
                nodes.append(GraphNode(target, use, "statement"))
                edges.append(GraphEdge(source, target, "flows-to"))
    return CodeGraph("dfg", nodes, edges)


def build_ssa_snapshot(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    for parsed_file in parsed_files:
        versions: dict[str, int] = defaultdict(int)
        for reference in parsed_file.references:
            if "=" not in reference.preview:
                continue
            name = reference.preview.split("=")[0].split()[-1]
            versions[name] += 1
            node_id = f"ssa:{parsed_file.path}:{name}:{versions[name]}"
            nodes.append(GraphNode(node_id, f"{name}.{versions[name]}", "variable"))
            edges.append(GraphEdge(f"file:{parsed_file.path}", node_id, "defines"))
    return CodeGraph("ssa", nodes, edges)


def build_call_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    symbols = {symbol.name: symbol for parsed_file in parsed_files for symbol in parsed_file.symbols}
    for parsed_file in parsed_files:
        body = "\n".join(node.text for node in parsed_file.ast["root_node"].children)
        for symbol in parsed_file.symbols:
            caller = f"symbol:{symbol.path}:{symbol.name}"
            nodes.append(GraphNode(caller, symbol.name, "function" if symbol.kind != "class" else "class"))
            for candidate in symbols.values():
                if candidate.name != symbol.name and f"{candidate.name}(" in body:
                    callee = f"symbol:{candidate.path}:{candidate.name}"
                    nodes.append(GraphNode(callee, candidate.name, "function" if candidate.kind != "class" else "class"))
                    edges.append(GraphEdge(caller, callee, "calls"))
    return CodeGraph("call", nodes, edges)


def build_dependency_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    for parsed_file in parsed_files:
        file_id = f"dep-file:{parsed_file.path}"
        package_id = f"dep-package:{_infer_package_name(parsed_file.path)}"
        nodes.append(GraphNode(file_id, parsed_file.path.rsplit("/", 1)[-1], "file"))
        nodes.append(GraphNode(package_id, _infer_package_name(parsed_file.path), "package"))
        edges.append(GraphEdge(file_id, package_id, "belongs-to"))
        for dependency in parsed_file.dependencies:
            dep_id = f"dep:{dependency}"
            nodes.append(GraphNode(dep_id, dependency, "module"))
            edges.append(GraphEdge(file_id, dep_id, "imports"))
    return CodeGraph("dependency", nodes, edges)


def build_api_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    for parsed_file in parsed_files:
        if "/app/api/" not in parsed_file.path and not parsed_file.path.endswith("/route.ts"):
            continue
        route_id = f"api-route:{parsed_file.path}"
        nodes.append(GraphNode(route_id, parsed_file.path, "route"))
        for method in _extract_api_methods(parsed_file):
            method_id = f"api-method:{parsed_file.path}:{method}"
            nodes.append(GraphNode(method_id, method, "function"))
            edges.append(GraphEdge(route_id, method_id, "handles"))
    return CodeGraph("api", nodes, edges)


def build_package_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    for parsed_file in parsed_files:
        package_name = _infer_package_name(parsed_file.path)
        package_id = f"pkg:{package_name}"
        file_id = f"pkg-file:{parsed_file.path}"
        nodes.append(GraphNode(package_id, package_name, "package"))
        nodes.append(GraphNode(file_id, parsed_file.path, "file"))
        edges.append(GraphEdge(file_id, package_id, "contained-in"))
    return CodeGraph("package", nodes, edges)


def build_database_graph(parsed_files: list[ParsedFile]) -> CodeGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    for parsed_file in parsed_files:
        if not parsed_file.database_entities:
            continue
        file_id = f"db-file:{parsed_file.path}"
        nodes.append(GraphNode(file_id, parsed_file.path, "database"))
        for entity in parsed_file.database_entities:
            table_id = f"db:{entity}"
            nodes.append(GraphNode(table_id, entity, "table"))
            edges.append(GraphEdge(file_id, table_id, "declares"))
    return CodeGraph("database", nodes, edges)


def build_repository_graph_bundle(snapshot: RepositorySnapshot, parsed_files: list[ParsedFile]) -> RepositoryGraphBundle:
    return RepositoryGraphBundle(
        repository_id=snapshot.repository_id,
        commit=snapshot.commit,
        graphs={
            "ast": build_ast_graph(parsed_files),
            "cfg": build_control_flow_graph(parsed_files),
            "dfg": build_data_flow_graph(parsed_files),
            "ssa": build_ssa_snapshot(parsed_files),
            "call": build_call_graph(parsed_files),
            "dependency": build_dependency_graph(parsed_files),
            "api": build_api_graph(parsed_files),
            "package": build_package_graph(parsed_files),
            "database": build_database_graph(parsed_files),
        },
    )


def _extract_assignments(parsed_file: ParsedFile) -> list[dict[str, list[str] | str]]:
    assignments: list[dict[str, list[str] | str]] = []
    for node in parsed_file.ast["root_node"].children:
        if not node.text.startswith(("const ", "let ", "var ", "export const ", "export let ", "export var ")):
            continue
        if "=" not in node.text:
            continue
        left, right = node.text.split("=", 1)
        name = left.split()[-1].strip()
        uses = [reference.preview for reference in parsed_file.references if name in reference.preview and reference.preview != node.text.strip()]
        assignments.append({"name": name, "value": right.strip(), "uses": uses})
    return assignments


def _extract_api_methods(parsed_file: ParsedFile) -> list[str]:
    methods: list[str] = []
    for node in parsed_file.ast["root_node"].children:
        text = node.text
        for method in ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]:
            if f"function {method}" in text or f"async function {method}" in text:
                methods.append(method)
    return sorted(set(methods))


def _infer_package_name(path: str) -> str:
    if path.startswith("frontend/apps/web/"):
        return "@lattix/web"
    if path.startswith("shared/"):
        return "@lattix/shared"
    if path.startswith("services/"):
        return "@lattix/services"
    return path.split("/", 1)[0]


def _walk_ast_graph(node, path: str, parent_id: str, nodes: list[GraphNode], edges: list[GraphEdge]) -> None:
    node_id = f"ast:{path}:{node.id}"
    nodes.append(GraphNode(node_id, node.kind, "class" if node.kind == "class" else "function" if node.kind == "function" else "statement"))
    edges.append(GraphEdge(parent_id, node_id, "contains"))
    for child in node.children:
        _walk_ast_graph(child, path, node_id, nodes, edges)

