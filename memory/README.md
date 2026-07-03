# Memory

## Purpose

Contains working, semantic, long-term, procedural, and organizational memory services and contracts.

## Owner Type

AI platform and data platform.

## Conventions

- Python packages use `lattix_memory`.
- Memory records must include scope, provenance, retention, permissions, and source references.
- Sensitive memories require redaction and access policy enforcement.
- Derived vector memory must be rebuildable from source records.

## Future Phase Dependencies

- Phase 15 implements the memory system.
- Phase 18 uses memory in chat.
- Phase 16 and Phase 19 use memory for agents.
- Phase 36 adds retention and privacy workflows.
