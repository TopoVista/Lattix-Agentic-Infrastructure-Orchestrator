# MCP Tool Ecosystem — Developer Guide

> Model Context Protocol servers and external tool integrations for AI agents.

## Overview (Phase 17)

The MCP Tool Ecosystem implements the [Model Context Protocol](https://modelcontextprotocol.io) to give AI agents standardized access to tools and resources.

## Registered Tools

| Tool | Type | Endpoint | Description |
|------|------|---------|-------------|
| `file-system` | resource | mcp://file-system | Browse and read filesystem |
| `git-operations` | resource | mcp://git | Git log, diff, blame, branches |
| `web-search` | tool | mcp://web-search | DuckDuckGo / Brave search |
| `code-execution` | tool | mcp://code-exec | Sandboxed Python/JS execution |
| `database-query` | tool | mcp://db-query | Read-only PostgreSQL queries |
| `kafka-producer` | tool | mcp://kafka | Publish events to Kafka topics |
| `aws-s3` | resource | mcp://s3 | S3/MinIO object storage |
| `github-api` | tool | mcp://github | GitHub REST API (PRs, issues, commits) |

## Using Tools from an Agent

```python
from lattix_agents import AgentRuntime
from services.tool_service import MCPClient

client = MCPClient()

# File system tool
result = client.call("file-system", "read", {
    "path": "src/lib/store.ts",
    "encoding": "utf-8"
})
print(result.content)

# Git operations tool
log = client.call("git-operations", "log", {
    "repo": ".",
    "limit": 10,
    "format": "oneline"
})
for commit in log.commits:
    print(f"{commit.sha[:7]} {commit.message}")

# Web search tool
search = client.call("web-search", "search", {
    "query": "Next.js 15 server actions best practices",
    "max_results": 5
})
for result in search.results:
    print(f"{result.title}: {result.url}")

# Code execution tool (sandboxed)
exec_result = client.call("code-execution", "run", {
    "language": "python",
    "code": "print(sum(range(100)))",
    "timeout_ms": 5000
})
print(exec_result.stdout)  # "4950"

# Database query tool (read-only)
rows = client.call("database-query", "query", {
    "sql": "SELECT id, title, status FROM tasks WHERE status = 'todo' LIMIT 10",
    "database": "lattix_workspace"
})
for row in rows.data:
    print(row)
```

## Registering a Custom Tool

```python
from services.tool_service import MCPToolServer, MCPTool

server = MCPToolServer()

@server.register_tool("my-custom-tool", type="tool")
def my_tool(params: dict) -> dict:
    """Custom tool that does something useful."""
    result = do_something(params["input"])
    return {"output": result, "status": "success"}

server.start(port=8090)
```

## Security

- `code-execution` runs in a **sandboxed Docker container** with no network access
- `database-query` is **read-only** (SELECT only, no DML/DDL)
- `kafka-producer` validates topic against allowlist before publishing
- All tool calls are **audited** to the security audit trail

## Running Tests

```bash
python -m pytest tests/test_mcp_tool_ecosystem.py -v
```
