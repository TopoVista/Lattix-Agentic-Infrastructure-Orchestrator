# Phase 13 - Code Completion Engine

## Goal

Build a repository-aware code completion and generation engine that understands local architecture, APIs, databases, tests, events, configuration, and coding style.

## Why This Phase Exists

Generic autocomplete is not enough for Lattix. Developers need suggestions that respect service boundaries, naming, database models, API contracts, event schemas, tests, deployment patterns, and existing code. This phase connects code intelligence to AI generation.

## Success Criteria

- Completion requests include repository, file, cursor, symbol, graph, and workspace context.
- Engine can generate controller, service, repository, DTO, tests, OpenAPI, Kafka events, and caching code as proposals.
- Suggestions include confidence, evidence, changed files, and safety notes.
- Editor accepts, rejects, or asks for explanation before applying suggestions.

## Deliverables

- Completion API service.
- Context builder.
- Prompt and policy templates.
- Generation planner.
- Diff proposal model.
- Editor integration for suggestions.
- Evaluation fixtures for common generation tasks.

## Folder Structure

```text
ai-platform/
  code-completion/
    api/
    context/
    prompts/
    planners/
    evaluators/
frontend/apps/web/components/editor/
  ai-suggestions.tsx
shared/
  ai-contracts/
```

## Modules To Build

- Completion API module.
- Repository context builder.
- Architecture context builder.
- Prompt assembly module.
- Generation planner module.
- Diff proposal module.
- Safety and policy module.
- Evaluation module.

## Functionality

- Complete code at cursor using nearby file context and repository intelligence.
- Generate multi-file changes for common backend, frontend, API, event, cache, and test tasks.
- Retrieve database schema, OpenAPI contracts, event contracts, naming patterns, and existing tests.
- Produce suggestions as diffs, not direct writes.
- Explain suggestion reasoning and evidence.
- Reject suggestions that violate architecture or security rules.

## Tech Stack

- FastAPI.
- Python.
- Repository intelligence APIs.
- Qdrant for semantic retrieval once embeddings exist.
- OpenSearch for lexical retrieval.
- LLM provider abstraction.
- TypeScript frontend integration.

## Implementation Plan

1. Define completion request and response contracts.
2. Build context retrieval by file, symbol, dependency graph, recent commits, tests, API contracts, and event schemas.
3. Build prompt templates for inline completion, explanation, and multi-file generation.
4. Build planner that decides whether a request is single-edit, multi-edit, or clarification-needed.
5. Build diff proposal response with changed files, hunks, tests, evidence, and confidence.
6. Add policy checks for secrets, destructive operations, dependency boundaries, and unsafe code.
7. Integrate suggestions into editor UI with preview and accept controls.
8. Add offline evaluation cases and regression checks.

## Functions / Classes / Interfaces To Implement

```python
def build_completion_context(request: CompletionRequest) -> CompletionContext:
    # Collects editor, repository, graph, API, database, style, and test context for generation.

def plan_generation(request: CompletionRequest, context: CompletionContext) -> GenerationPlan:
    # Chooses inline completion, explanation, refactor, or multi-file proposal strategy.

def generate_code_proposal(plan: GenerationPlan) -> CodeProposal:
    # Calls the model and returns diff hunks, explanation, evidence, confidence, and test suggestions.

def enforce_generation_policy(proposal: CodeProposal) -> PolicyCheckResult:
    # Rejects proposals with secrets, forbidden APIs, unsafe infra actions, or boundary violations.

def rank_suggestions(suggestions: list[CodeProposal]) -> list[CodeProposal]:
    # Sorts proposals by relevance, confidence, architectural fit, and edit distance.
```

## Configuration / Environment Variables

- `LLM_PROVIDER`
- `LLM_API_KEY`
- `COMPLETION_MODEL`
- `COMPLETION_MAX_CONTEXT_TOKENS`
- `COMPLETION_TIMEOUT_MS`
- `CODE_COMPLETION_ENABLED`
- `QDRANT_URL`
- `OPENSEARCH_URL`

## Data Models / Schemas / Contracts

- `CompletionRequest`: workspaceId, repositoryId, branch, commit, path, cursor, selection, intent.
- `CompletionContext`: files, symbols, graphNeighbors, apiContracts, schemas, tests, styleExamples.
- `GenerationPlan`: mode, steps, requiredContext, riskLevel, needsApproval.
- `CodeProposal`: files, hunks, explanation, evidence, confidence, tests, policyResult.
- `PolicyCheckResult`: allowed, violations, warnings, requiredApproval.

## Testing Plan

- Unit tests for context assembly and policy checks.
- Golden tests for prompt assembly.
- Evaluation fixtures for controller, service, DTO, test, OpenAPI, Kafka event, and cache generation.
- Editor integration tests for preview and accept flow.
- Regression tests for not leaking secrets or crossing forbidden module boundaries.

## Acceptance Criteria

- Suggestions are repository-aware and cite the context used.
- Multi-file changes are previewed as diffs.
- Unsafe proposals are blocked or require approval.
- Evaluation suite tracks quality over time.

## Risks And Mitigations

- Risk: model hallucination. Mitigation: retrieve evidence, constrain outputs to diffs, and add fact checks.
- Risk: generated code breaks architecture. Mitigation: policy checks and boundary validation.
- Risk: high latency. Mitigation: context caching and request budgets.

## Next Phase Handoff

Phase 14 should make repository, people, infra, incidents, requirements, and decisions queryable through a persistent knowledge graph.
