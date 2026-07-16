# Knowledge Graph — Developer Guide

> Neo4j-backed graph connecting code, people, infra, incidents, requirements, and decisions.

## Overview (Phase 14)

The Knowledge Graph is the central intelligence layer of Lattix. It maintains a living, queryable model of everything in your engineering organization.

## Node Types

| Node Label | Properties | Description |
|-----------|-----------|-------------|
| `Code` | name, file, kind, language, loc | Functions, classes, modules |
| `Developer` | id, name, email, team | Team members and AI agents |
| `Repo` | id, name, provider, branch | Repositories |
| `Service` | id, name, port, language | Microservices |
| `Incident` | id, title, severity, status | Past incidents |
| `Decision` | id, title, status, drivers | Architecture decision records |
| `Requirement` | id, title, priority, status | Product requirements |
| `Cost` | id, resource, monthly_usd | Cost centers |
| `Infra` | id, type, region, provider | Infrastructure resources |

## Edge Types

| Relationship | From → To | Meaning |
|-------------|----------|---------|
| `CALLS` | Code → Code | Function/service calls |
| `DEPENDS_ON` | Service → Service | Runtime dependency |
| `AUTHORED_BY` | Code/Repo → Developer | Authorship |
| `DEPLOYED_TO` | Service → Infra | Deployment target |
| `RESOLVED_BY` | Incident → Developer | Incident resolution |
| `DOCUMENTS` | Decision → Code/Service | ADR coverage |

## Python Usage

```python
from lattix_knowledge_graph import KnowledgeGraphService

kg = KnowledgeGraphService()

# Add a code node
kg.add_node("Code", {
    "name": "addTask",
    "file": "src/lib/store.ts",
    "kind": "function",
    "language": "typescript"
})

# Add a relationship
kg.add_edge("Code:addTask", "AUTHORED_BY", "Developer:owner@lattix.io")

# Query: who maintains auth-service?
maintainers = kg.query("""
    MATCH (d:Developer)-[:AUTHORED_BY]-(c:Code)-[:BELONGS_TO]-(s:Service {name: 'auth-service'})
    RETURN d.name, count(c) as contributions
    ORDER BY contributions DESC
""")

# Find impacted services when a code symbol changes
impacted = kg.find_impact("Code:WorkspaceShell")
print(f"Changing WorkspaceShell impacts: {[n.name for n in impacted]}")
```

## Importers

```python
from knowledge_graph.importers import GitImporter, CodeImporter, InfraImporter

# Import from git history
git_importer = GitImporter(repo_path="./")
git_importer.run()  # Creates Developer + Code nodes from git log

# Import code structure
code_importer = CodeImporter(repo_path="./", language="typescript")
code_importer.run()  # Creates Code nodes + CALLS edges

# Import infra
infra_importer = InfraImporter(terraform_path="./terraform/")
infra_importer.run()  # Creates Infra nodes
```

## Running Tests

```bash
python -m pytest tests/test_knowledge_graph.py -v
```
