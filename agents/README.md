# Agents

## Purpose

Contains the multi-agent runtime, supervisor, planner, decomposer, scheduler, execution engine, evaluators, reviewers, critics, recovery agents, approval flows, and specialized role agents.

## Owner Type

AI platform engineering.

## Conventions

- Python packages use `lattix_agents`.
- Agents must call external systems through the MCP tool gateway, not direct credentials.
- Every agent task must carry workspace, actor, trace, risk, evidence, and policy context.
- Destructive or privileged actions require approval.
- Agent outputs must include evidence and confidence where relevant.

## Future Phase Dependencies

- Phase 15 provides memory.
- Phase 16 implements the multi-agent platform.
- Phase 17 provides tool integrations.
- Phase 19 adds specialized AI software engineer agents.
