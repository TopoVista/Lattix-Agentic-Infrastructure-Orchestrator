"use client";

import { Sparkles } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { AiSuggestion, InlineExplanation } from "@lattix/code-intelligence";

export function AiSuggestions({
  explanation,
  suggestions
}: {
  explanation: InlineExplanation | null;
  suggestions: AiSuggestion[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-accent2" />
          AI suggestions
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        {explanation ? (
          <div className="rounded-md border border-line bg-[#10192e] p-3">
            <div className="text-sm font-medium text-text">{explanation.summary}</div>
            <div className="mt-2 text-sm text-muted">{explanation.insight}</div>
            <div className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">Actions</div>
            <ul className="mt-2 space-y-1 text-sm text-text">
              {explanation.suggestedActions.map((action) => (
                <li key={action} className="rounded bg-[#09111f] px-2 py-1">
                  {action}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="rounded-md border border-line bg-[#10192e] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium text-text">{suggestion.title}</div>
              <div className="text-xs text-accent">{Math.round(suggestion.confidence * 100)}%</div>
            </div>
            <div className="mt-2 text-sm text-muted">{suggestion.details}</div>
            <pre className="mt-3 overflow-x-auto rounded bg-[#09111f] p-2 text-xs text-muted">{suggestion.code}</pre>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
