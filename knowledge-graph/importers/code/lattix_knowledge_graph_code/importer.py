from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class KnowledgeGraphStatement:
    subject: str
    predicate: str
    object: str
    confidence: float
    source_path: str
    commit: str


def import_repository_intelligence(facts) -> list[KnowledgeGraphStatement]:
    return [
        KnowledgeGraphStatement(
            subject=fact.subject,
            predicate=fact.predicate,
            object=fact.object,
            confidence=fact.confidence,
            source_path=fact.source_path,
            commit=fact.commit,
        )
        for fact in facts
    ]

