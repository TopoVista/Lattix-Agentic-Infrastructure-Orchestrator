# Phase 18 - Intelligent Chatbot Pipeline

## Goal

Build the Lattix chatbot pipeline that turns user messages into intent, plans, retrieved evidence, tool calls, reasoning, verification, fact checking, confidence scoring, and grounded answers.

## Why This Phase Exists

A direct user-to-LLM path is not reliable enough for engineering operations. Lattix needs a pipeline that gathers context from knowledge graph, repository search, semantic search, logs, metrics, memory, and tools before answering or acting.

## Success Criteria

- Chat requests pass through intent detection, planning, retrieval, tool selection, reasoning, reflection, verification, fact checking, and confidence scoring.
- Answers cite evidence and disclose uncertainty.
- Action-taking flows route through agent tasks and approval gates.
- Conversation state is stored with memory policy enforcement.
- The frontend supports streaming answers and tool progress.

## Deliverables

- Chat API service.
- Pipeline orchestrator.
- Intent classifier.
- Retrieval planner.
- Tool selection module.
- Reasoning and response generator.
- Verification and fact checker.
- Confidence scorer.
- Chat UI integration.

## Folder Structure

```text
ai-platform/
  chat-pipeline/
    api/
    intent/
    planner/
    retrieval/
    tools/
    reasoning/
    reflection/
    verification/
    confidence/
frontend/apps/web/components/chat/
shared/
  chat-contracts/
```

## Modules To Build

- Chat API module.
- Conversation state module.
- Intent classifier module.
- Retrieval planner module.
- Context aggregator module.
- Tool selection module.
- Reasoning module.
- Reflection and verification module.
- Fact checking module.
- Confidence scoring module.
- Streaming response module.

## Functionality

- Classify user intent: answer, inspect, explain, generate, plan, execute, debug, deploy, investigate, or approve.
- Build a plan for context retrieval and possible tool use.
- Retrieve evidence from knowledge graph, repository search, semantic memory, logs, metrics, documents, and tools.
- Generate answers with citations and confidence.
- Start agent tasks when the user asks for action.
- Stream progress events to the frontend.
- Store conversation memory according to policy.

## Tech Stack

- FastAPI.
- Server-sent events or WebSocket streaming.
- Redis for active conversation state.
- PostgreSQL for durable conversation metadata.
- Qdrant, OpenSearch, Neo4j, ClickHouse, Loki, Prometheus as retrieval sources.
- MCP tool gateway.
- LLM provider abstraction.

## Implementation Plan

1. Define chat request, stream event, evidence, answer, and action contracts.
2. Implement conversation state with workspace, repository, user, and memory scope.
3. Implement intent classifier and risk classifier.
4. Implement retrieval planner that selects graph, lexical, semantic, logs, metrics, memory, or tools.
5. Implement context aggregator with deduplication, ranking, and token budgeting.
6. Implement response generation with citations.
7. Implement reflection and verifier pass for unsupported claims, missing evidence, and policy issues.
8. Implement confidence scoring and answer metadata.
9. Integrate frontend streaming UI.
10. Route action requests to multi-agent platform.

## Functions / Classes / Interfaces To Implement

```python
def classify_intent(message: ChatMessage) -> IntentResult:
    # Determines user intent, risk level, required context, and whether action may be needed.

def plan_retrieval(intent: IntentResult, conversation: ConversationState) -> RetrievalPlan:
    # Chooses knowledge, repository, semantic, log, metric, memory, and tool retrieval steps.

def aggregate_context(plan: RetrievalPlan) -> ContextBundle:
    # Executes retrieval, ranks evidence, deduplicates facts, and enforces permissions.

def generate_answer(bundle: ContextBundle, intent: IntentResult) -> DraftAnswer:
    # Produces a grounded answer or action proposal with citations and reasoning summary.

def verify_answer(answer: DraftAnswer, evidence: ContextBundle) -> VerificationReport:
    # Checks claims against evidence and flags unsupported, stale, or risky content.

def score_confidence(report: VerificationReport) -> ConfidenceScore:
    # Computes answer confidence from evidence quality, freshness, agreement, and risk.
```

## Configuration / Environment Variables

- `CHAT_MODEL`
- `CHAT_MAX_CONTEXT_TOKENS`
- `CHAT_STREAM_TIMEOUT_MS`
- `CHAT_MEMORY_ENABLED`
- `CHAT_FACT_CHECK_ENABLED`
- `CHAT_MIN_CONFIDENCE_FOR_ACTION`
- `CHAT_DEFAULT_RETRIEVAL_LIMIT`

## Data Models / Schemas / Contracts

- `ChatMessage`: conversationId, actor, workspaceId, content, attachments, timestamp.
- `IntentResult`: intent, risk, requiredSources, actionCandidate, confidence.
- `RetrievalPlan`: steps, sources, budgets, requiredEvidence, toolCandidates.
- `ContextBundle`: evidenceItems, sources, deniedItems, freshness, tokenUsage.
- `DraftAnswer`: content, citations, actionProposal, assumptions, limitations.
- `VerificationReport`: supportedClaims, unsupportedClaims, conflicts, riskFindings.

## Testing Plan

- Unit tests for intent classification and retrieval planning.
- Fixture tests for grounded answers with citations.
- Verification tests for unsupported claims.
- Streaming API tests.
- End-to-end chat tests for explain, debug, inspect, and action-request scenarios.

## Acceptance Criteria

- Chat answers are grounded in retrieved evidence.
- Unsupported claims are flagged or removed.
- Actions are routed to agents and approvals, not silently executed.
- Users see progress for retrieval, tools, reasoning, and verification.

## Risks And Mitigations

- Risk: answers sound confident without evidence. Mitigation: verification pass and confidence score.
- Risk: retrieval misses important facts. Mitigation: multi-source retrieval and source diagnostics.
- Risk: action requests bypass policy. Mitigation: route actions through agent platform.

## Next Phase Handoff

Phase 19 should build specialized AI engineer agents that use this chat and agent infrastructure for role-specific work.
