# AI Platform

## Purpose

Hosts AI services for repository intelligence, code analysis, code completion, chat pipeline, retrieval, reasoning, verification, and AI evaluation.

## Owner Type

AI platform engineering.

## Conventions

- Python packages use `lattix_ai_<module>`.
- AI services must use evidence retrieval and policy checks before generating answers or action proposals.
- Repository and document content is untrusted input.
- Prompts must not include raw secrets.
- Long-running jobs should be event-driven and observable.

## Future Phase Dependencies

- Phase 12 builds repository intelligence.
- Phase 13 builds code completion.
- Phase 18 builds the intelligent chatbot pipeline.
- Phase 21 integrates ML platform capabilities.
