# AI Platform — Developer Guide

> Python AI services for repository intelligence, code completion, and intelligent chatbot pipeline.

## Modules

### Repository Intelligence (Phase 12)
```
ai-platform/repository-intelligence/
```
Indexes codebases into structural graphs for AI consumption.

**Usage:**
```python
from lattix_ai_repository_intelligence import RepositoryIntelligenceService

svc = RepositoryIntelligenceService()

# Index a repository
result = svc.index_repository(repo_path="./", branch="main")
print(f"Indexed {result.file_count} files, {result.symbol_count} symbols")

# Query the structural graph
symbols = svc.query_symbols(query="WorkspaceShell", repo_id="repo-platform")
for s in symbols:
    print(f"{s.kind}: {s.name} at {s.file}:{s.line}")
```

### Code Completion Engine (Phase 13)
```
ai-platform/code-completion/
```
Repository-aware generation for code, tests, APIs, events, and configs.

**Usage:**
```python
from lattix_code_completion import CodeCompletionEngine

engine = CodeCompletionEngine()

# Generate code completion
result = engine.complete(
    file_path="src/components/MyComponent.tsx",
    cursor_position=42,
    context_window=1024,
    repository_id="repo-platform"
)
print(result.completion)

# Generate a test
test = engine.generate_test(
    source_file="src/lib/store.ts",
    function_name="addTask",
    test_framework="vitest"
)
print(test.code)
```

### Chat Pipeline (Phase 18)
```
ai-platform/chat-pipeline/
```
Intent → planning → retrieval → reasoning → verification → fact-checking pipeline.

**Usage:**
```python
from lattix_chat_pipeline import ChatPipelineService

pipeline = ChatPipelineService()

# Process a user message
response = pipeline.process(
    message="What are the recent incidents in the auth service?",
    context={"workspace_id": "ws-lattix", "user_id": "owner@lattix.io"}
)

print(f"Intent: {response.intent}")
print(f"Answer: {response.answer}")
print(f"Confidence: {response.confidence}")
print(f"Sources: {response.sources}")
```

## Running Tests

```bash
python -m pytest ai-platform/ -v
```
