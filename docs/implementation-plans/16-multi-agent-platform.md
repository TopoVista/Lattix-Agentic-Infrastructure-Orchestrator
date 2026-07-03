# Phase 16 - Multi-Agent Platform

## Goal

Build the Lattix multi-agent orchestration platform with supervisor, planner, task decomposition, scheduling, execution, reflection, evaluation, memory, knowledge, routing, tool, review, critique, learning, recovery, and human approval agents.

## Why This Phase Exists

Lattix is not a single chatbot. It is an engineering operating system where specialized agents plan, coordinate, use tools, verify results, learn from outcomes, and ask humans for approval when risk is high. This phase creates the control plane for agent work.

## Success Criteria

- Agent runtime supports task state, planning, scheduling, execution, tool calls, memory, and knowledge retrieval.
- Human approval gates exist for destructive, privileged, or production-impacting actions.
- Reflection, evaluation, review, critique, recovery, and learning loops are modeled.
- Agent actions are traceable, auditable, replayable, and resumable.
- Tool permissions and agent scopes are enforced.

## Deliverables

- Agent runtime service.
- Agent registry.
- Task planner and decomposer.
- Scheduler and execution engine.
- Tool invocation gateway.
- Approval workflow.
- Evaluation and reflection pipeline.
- Agent event contracts.

## Folder Structure

```text
agents/
  runtime/
  supervisor-agent/
  planner-agent/
  task-decomposer/
  scheduler/
  execution-engine/
  reflection-engine/
  evaluation-engine/
  memory-agent/
  knowledge-agent/
  routing-agent/
  tool-agent/
  reviewer-agent/
  critic-agent/
  learning-agent/
  recovery-agent/
  human-approval-agent/
shared/
  agent-contracts/
```

## Modules To Build

- Agent runtime module.
- Agent registry module.
- Planning and decomposition module.
- Scheduler module.
- Execution engine module.
- Tool gateway module.
- Approval module.
- Evaluation and reflection module.
- Recovery module.
- Learning module.

## Functionality

- Accept user or system goals and convert them to task graphs.
- Route tasks to specialized agents based on capability, risk, context, and permissions.
- Execute tool calls through governed adapters.
- Persist task state, intermediate reasoning summaries, tool results, evidence, and approvals.
- Reflect on outputs, evaluate success, and trigger recovery when tasks fail.
- Learn reusable procedures after successful repeated workflows.

## Tech Stack

- FastAPI for agent runtime APIs.
- Python for orchestration.
- Redis for active task state.
- PostgreSQL for durable task records.
- Kafka for agent events.
- Qdrant and Neo4j for memory and knowledge.
- OpenTelemetry for traces.

## Implementation Plan

1. Define agent task, agent capability, tool call, approval, and evaluation contracts.
2. Implement agent registry with roles, permissions, tools, and routing metadata.
3. Implement supervisor agent that owns task lifecycle.
4. Implement planner and task decomposer that produce task graphs.
5. Implement scheduler that orders tasks by dependencies, priority, and risk.
6. Implement execution engine that runs agent steps and tool calls.
7. Implement approval workflow for high-risk steps.
8. Implement reflection, review, critic, evaluation, and recovery loops.
9. Integrate memory and knowledge agents for context retrieval.
10. Emit trace, audit, and learning events.

## Functions / Classes / Interfaces To Implement

```python
def create_agent_task(request: AgentTaskRequest) -> AgentTask:
    # Creates a durable task with goal, actor, workspace, risk level, context, and status.

def plan_task_graph(task: AgentTask) -> TaskGraph:
    # Decomposes a goal into ordered steps, dependencies, required agents, tools, and approvals.

def schedule_next_step(task_graph: TaskGraph) -> ScheduledStep:
    # Selects the next executable step based on dependency, priority, risk, and resource limits.

def execute_agent_step(step: ScheduledStep) -> AgentStepResult:
    # Runs an agent step with memory, knowledge, tool, policy, timeout, and trace context.

def request_human_approval(request: ApprovalRequest) -> ApprovalDecision:
    # Pauses a task until an authorized human approves, rejects, or modifies a risky action.

def evaluate_agent_result(result: AgentStepResult) -> EvaluationReport:
    # Scores correctness, evidence, policy compliance, completeness, and next action.
```

## Configuration / Environment Variables

- `AGENT_RUNTIME_CONCURRENCY`
- `AGENT_STEP_TIMEOUT_MS`
- `AGENT_APPROVAL_REQUIRED_RISK_LEVEL`
- `AGENT_MAX_TOOL_CALLS_PER_TASK`
- `AGENT_MEMORY_ENABLED`
- `AGENT_KNOWLEDGE_ENABLED`
- `KAFKA_BOOTSTRAP_SERVERS`
- `REDIS_URL`

## Data Models / Schemas / Contracts

- `AgentTask`: id, goal, actor, workspaceId, status, riskLevel, context, createdAt.
- `TaskGraph`: taskId, nodes, edges, approvals, status.
- `AgentCapability`: agentType, tools, permissions, inputTypes, outputTypes.
- `ToolCall`: id, toolName, input, output, status, risk, auditId.
- `ApprovalRequest`: actor, action, risk, evidence, expiresAt, requiredRole.
- `EvaluationReport`: score, findings, evidence, retryable, recoveryPlan.

## Testing Plan

- Unit tests for task decomposition, routing, scheduling, and policy checks.
- Integration tests for task lifecycle with Redis, Postgres, and Kafka.
- Approval flow tests for destructive actions.
- Failure and recovery tests for tool timeout, bad output, and rejected approval.
- Trace tests to ensure every task step emits observable spans.

## Acceptance Criteria

- Agents can execute a simple multi-step engineering task with traceable state.
- High-risk actions pause for human approval.
- Failed steps can retry, recover, or escalate.
- Agent outputs include evidence and evaluation results.

## Risks And Mitigations

- Risk: agents act beyond authority. Mitigation: scoped permissions, tool gateway policy, and approval gates.
- Risk: tasks become opaque. Mitigation: event logs, traces, evidence bundles, and evaluation reports.
- Risk: infinite loops. Mitigation: step, time, retry, and tool-call budgets.

## Next Phase Handoff

Phase 17 should expose external systems through governed MCP tools that agents can call safely.
