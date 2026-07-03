# Phase 19 - AI Software Engineers

## Goal

Implement specialized AI software engineer agents for leadership, planning, architecture, backend, frontend, DevOps, database, security, cloud, Kubernetes, Terraform, networking, ML, data, monitoring, optimization, documentation, testing, review, refactoring, debugging, deployment, incident response, and cost optimization.

## Why This Phase Exists

Different engineering jobs require different context, tools, policies, evaluation criteria, and output formats. Specialized agents let Lattix route work to the right capability while preserving shared orchestration, approval, memory, and audit controls.

## Success Criteria

- Agent roles are registered with capabilities, tools, permissions, prompts, evaluation rubrics, and risk limits.
- Role agents produce structured outputs with evidence and test recommendations.
- Agents can collaborate through task graphs.
- High-risk role actions require approval.
- Agent performance can be evaluated by task type.

## Deliverables

- Agent role registry.
- Role-specific prompt and policy packs.
- Capability and tool mappings.
- Evaluation rubrics.
- Collaboration patterns.
- Example task fixtures.

## Folder Structure

```text
agents/
  roles/
    ceo/
    planner/
    architect/
    backend/
    frontend/
    devops/
    database/
    security/
    cloud/
    kubernetes/
    terraform/
    networking/
    ml/
    data-engineering/
    data-science/
    monitoring/
    optimization/
    documentation/
    testing/
    code-review/
    refactoring/
    debugging/
    deployment/
    incident-response/
    cost-optimization/
  evaluation/
  collaboration/
```

## Modules To Build

- Role registry module.
- Capability profiles module.
- Prompt packs module.
- Tool permission mapping module.
- Collaboration workflow module.
- Evaluation rubric module.
- Role-specific fixtures module.

## Functionality

- Route tasks to role agents based on intent and capability.
- Let agents request context from repository intelligence, memory, knowledge graph, observability, cloud, and tools.
- Generate structured artifacts: plans, diffs, reviews, runbooks, incident reports, Terraform plans, test strategies, diagrams, and cost recommendations.
- Coordinate multiple role agents on complex tasks.
- Evaluate role outputs against rubrics.

## Tech Stack

- Multi-agent runtime from phase 16.
- Chat pipeline from phase 18.
- MCP tools from phase 17.
- YAML or JSON role manifests.
- LLM provider abstraction.
- Evaluation harness.

## Implementation Plan

1. Define common `AgentRoleManifest` schema.
2. Create role manifests for all listed engineering roles.
3. Define allowed tools, forbidden tools, approval requirements, and context sources per role.
4. Create prompt packs for planning, code generation, review, incident response, deployment, and cost analysis.
5. Create output schemas for each role.
6. Implement role routing and collaboration workflows.
7. Add evaluation fixtures for representative role tasks.
8. Add telemetry for role usage, success rate, failure modes, and approval frequency.

## Functions / Classes / Interfaces To Implement

```python
def register_agent_role(manifest: AgentRoleManifest) -> AgentRole:
    # Validates role capabilities, tools, prompt pack, output schemas, and risk limits.

def route_to_role(request: RoleRoutingRequest) -> RoleRoutingDecision:
    # Chooses one or more role agents based on task intent, context, risk, and permissions.

def run_role_agent(request: RoleAgentRunRequest) -> RoleAgentResult:
    # Executes a role-specific task with context, tools, memory, and output schema validation.

def coordinate_role_agents(request: CollaborationRequest) -> CollaborationResult:
    # Runs multiple agents in sequence or parallel and merges reviewed outputs.

def evaluate_role_output(result: RoleAgentResult) -> RoleEvaluation:
    # Scores output against role rubric, evidence quality, policy compliance, and usefulness.
```

## Configuration / Environment Variables

- `ROLE_AGENT_DEFAULT_MODEL`
- `ROLE_AGENT_MAX_STEPS`
- `ROLE_AGENT_EVALUATION_ENABLED`
- `ROLE_AGENT_APPROVAL_RISK_LEVEL`
- `ROLE_MANIFEST_DIR`

## Data Models / Schemas / Contracts

- `AgentRoleManifest`: name, capabilities, tools, contextSources, prompts, outputSchemas, policies.
- `RoleRoutingDecision`: selectedRoles, rationale, requiredApprovals, expectedOutputs.
- `RoleAgentResult`: role, output, evidence, toolCalls, policyFindings, confidence.
- `CollaborationResult`: participants, intermediateResults, finalOutput, disagreements, review.
- `RoleEvaluation`: score, rubricFindings, failures, improvementSuggestions.

## Testing Plan

- Manifest validation tests for every role.
- Routing tests for common engineering intents.
- Role output schema tests.
- Collaboration tests for architect plus backend plus testing flows.
- Safety tests for deployment, Terraform, security, and incident roles.

## Acceptance Criteria

- Every requested role exists as a registered capability.
- Role outputs are structured and evidence-backed.
- Multi-agent collaboration can produce a reviewed plan or proposal.
- High-risk role actions are blocked without approval.

## Risks And Mitigations

- Risk: roles overlap and conflict. Mitigation: define responsibility boundaries and collaboration rules.
- Risk: specialized prompts become stale. Mitigation: version prompt packs and evaluate fixtures.
- Risk: agents appear authoritative without validation. Mitigation: rubrics, critics, reviewers, and confidence scoring.

## Next Phase Handoff

Phase 20 should build the data engineering platform that supplies large-scale event, feature, analytics, and ML pipelines for agents and predictions.
