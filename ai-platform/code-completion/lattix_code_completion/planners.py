from __future__ import annotations

from .models import CompletionContext, CompletionRequest, GenerationPlan


def plan_generation(request: CompletionRequest, context: CompletionContext) -> GenerationPlan:
    intent = (request.intent or "").strip().lower()

    if any(word in intent for word in ["explain", "why", "how"]):
        mode = "explanation"
        steps = ["Analyze context and references", "Explain code behavior, dependencies, and side effects"]
        risk_level = "low"
        needs_approval = False
    elif any(word in intent for word in ["refactor", "rename", "move", "clean", "restructure"]):
        mode = "refactor"
        steps = ["Find all references and call sites", "Plan modification", "Apply changes as diff proposals", "Verify boundary rules"]
        risk_level = "medium"
        needs_approval = True
    elif any(word in intent for word in ["create", "add", "generate", "scaffold"]) or (request.intent and len(request.intent) > 0):
        mode = "proposal"
        steps = ["Inspect architecture and contracts", "Generate scaffold implementation", "Generate test suggestions"]
        risk_level = "medium"
        needs_approval = True
    else:
        mode = "completion"
        steps = ["Analyze local surrounding lines", "Synthesize inline completion at cursor position"]
        risk_level = "low"
        needs_approval = False

    required_context = []
    if context.files:
        required_context.append("current-file")
    if context.symbols:
        required_context.append("symbols")
    if context.graph_neighbors:
        required_context.append("graph-neighborhood")
    if context.api_contracts:
        required_context.append("api-contracts")
    if context.schemas:
        required_context.append("database-schemas")

    return GenerationPlan(
        mode=mode,  # type: ignore[arg-type]
        steps=steps,
        required_context=required_context,
        risk_level=risk_level,  # type: ignore[arg-type]
        needs_approval=needs_approval,
        request=request,
        context=context,
    )

