from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .models import (
    ChatMessage,
    ContextBundle,
    ConfidenceScore,
    DraftAnswer,
    IntentResult,
    RetrievalPlan,
    VerificationReport,
)


@dataclass(slots=True)
class ChatPipeline:
    def classify_intent(self, message: ChatMessage) -> IntentResult:
        lower = message.content.lower()
        if "deploy the change" in lower or "deploy to production" in lower or "execute now" in lower or "run deployment" in lower:
            return IntentResult(
                intent="execute",
                risk="high",
                required_sources=["tool", "memory"],
                action_candidate=True,
                confidence=0.93,
            )
        if "debug" in lower:
            return IntentResult(
                intent="debug",
                risk="medium",
                required_sources=["logs", "metrics", "repository"],
                action_candidate=False,
                confidence=0.9,
            )
        if "explain" in lower or "issue" in lower:
            return IntentResult(
                intent="explain",
                risk="low",
                required_sources=["knowledge", "repository"],
                action_candidate=False,
                confidence=0.8,
            )
        return IntentResult(
            intent="explain",
            risk="low",
            required_sources=["knowledge", "repository"],
            action_candidate=False,
            confidence=0.8,
        )

    def plan_retrieval(self, intent: IntentResult, conversation: ChatMessage) -> RetrievalPlan:
        steps = ["retrieve_context"]
        sources = list(intent.required_sources)
        budgets = {"tokens": 2000}
        required_evidence = ["evidence", "citations"]
        tool_candidates: list[str] = []
        if intent.action_candidate:
            tool_candidates.append("approval-gateway")
        return RetrievalPlan(steps=steps, sources=sources, budgets=budgets, required_evidence=required_evidence, tool_candidates=tool_candidates)

    def aggregate_context(self, plan: RetrievalPlan) -> ContextBundle:
        evidence_items = [
            {"source": source, "summary": f"evidence from {source}"}
            for source in plan.sources
        ]
        return ContextBundle(
            evidence_items=evidence_items,
            sources=plan.sources,
            denied_items=[],
            freshness="fresh",
            token_usage=plan.budgets.get("tokens", 0),
        )

    def generate_answer(self, bundle: ContextBundle, intent: IntentResult) -> DraftAnswer:
        content = (
            f"Grounded answer for intent '{intent.intent}' using {len(bundle.evidence_items)} evidence items."
        )
        citations = [item["source"] for item in bundle.evidence_items]
        action_proposal = "Route to agent approval workflow" if intent.action_candidate else None
        return DraftAnswer(
            content=content,
            citations=citations,
            action_proposal=action_proposal,
            assumptions=["evidence was retrieved from the configured sources"],
            limitations=["this is a scaffolded response"],
        )

    def verify_answer(self, answer: DraftAnswer, evidence: ContextBundle) -> VerificationReport:
        supported_claims = ["answer is grounded"]
        unsupported_claims = []
        conflicts = []
        risk_findings = []
        if not evidence.evidence_items:
            unsupported_claims.append("no evidence available")
        return VerificationReport(
            supported_claims=supported_claims,
            unsupported_claims=unsupported_claims,
            conflicts=conflicts,
            risk_findings=risk_findings,
        )

    def score_confidence(self, report: VerificationReport) -> ConfidenceScore:
        score = 0.8 if not report.unsupported_claims else 0.4
        return ConfidenceScore(score=score, reasons=["evidence-backed"])
