"use client";

import { useState } from "react";
import { Sparkles, CheckCircle, XCircle, ChevronDown, ChevronRight, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { AiSuggestion, InlineExplanation } from "@lattix/code-intelligence";
import type { CodeProposal, PolicyCheckResult } from "@lattix/ai-contracts";

function DiffHunkView({ before, after, path }: { before: string; after: string; path: string }) {
  return (
    <div className="mt-3 rounded-md border border-line bg-[#07101d] text-xs">
      <div className="flex items-center gap-2 border-b border-line px-3 py-1.5 text-muted">
        <span className="font-mono text-accent2">{path.split("/").pop()}</span>
      </div>
      {before && (
        <pre className="overflow-x-auto px-3 py-1.5 text-red-400 line-through opacity-70 whitespace-pre-wrap">{before}</pre>
      )}
      {after && (
        <pre className="overflow-x-auto border-t border-line px-3 py-1.5 text-green-400 whitespace-pre-wrap">{after}</pre>
      )}
    </div>
  );
}

function PolicyBadge({ policy }: { policy: PolicyCheckResult }) {
  if (policy.allowed && !policy.warnings.length) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-400">
        <ShieldCheck className="size-3" /> Safe
      </span>
    );
  }
  if (!policy.allowed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-900/40 px-2 py-0.5 text-xs text-red-400">
        <ShieldAlert className="size-3" /> Blocked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-900/40 px-2 py-0.5 text-xs text-amber-400">
      <AlertTriangle className="size-3" /> Needs review
    </span>
  );
}

function CodeProposalCard({
  proposal,
  index,
  onAccept,
  onReject
}: {
  proposal: CodeProposal;
  index: number;
  onAccept: (proposal: CodeProposal) => void;
  onReject: (index: number) => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const policy = proposal.policyResult;
  const blocked = policy ? !policy.allowed : false;

  return (
    <div className="rounded-md border border-line bg-[#10192e] overflow-hidden">
      <button
        id={`proposal-toggle-${index}`}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {expanded ? <ChevronDown className="size-3.5 shrink-0 text-muted" /> : <ChevronRight className="size-3.5 shrink-0 text-muted" />}
          <span className="truncate text-sm font-medium text-text">
            {proposal.explanation || `Proposal ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-accent">{Math.round(proposal.confidence * 100)}%</span>
          {policy && <PolicyBadge policy={policy} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-line px-3 pb-3 pt-2 space-y-3">
          {/* Evidence */}
          {proposal.evidence.length > 0 && (
            <div>
              <div className="mb-1 text-xs uppercase tracking-widest text-muted">Evidence</div>
              <ul className="space-y-0.5">
                {proposal.evidence.map((e: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-text/70">
                    <span className="mt-0.5 size-1 shrink-0 rounded-full bg-accent2" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Policy violations/warnings */}
          {policy && !policy.allowed && policy.violations.length > 0 && (
            <div className="rounded border border-red-900/50 bg-red-900/20 p-2">
              <div className="mb-1 text-xs font-semibold text-red-400">Policy Violations</div>
              {policy.violations.map((v: string, i: number) => (
                <div key={i} className="text-xs text-red-300">{v}</div>
              ))}
            </div>
          )}
          {policy && policy.warnings.length > 0 && (
            <div className="rounded border border-amber-900/50 bg-amber-900/20 p-2">
              <div className="mb-1 text-xs font-semibold text-amber-400">Warnings</div>
              {policy.warnings.map((w: string, i: number) => (
                <div key={i} className="text-xs text-amber-300">{w}</div>
              ))}
            </div>
          )}

          {/* Diffs */}
          {proposal.hunks.length > 0 && (
            <div>
              <div className="mb-1 text-xs uppercase tracking-widest text-muted">Diff Preview</div>
              {proposal.hunks.map((hunk: { path: string; before: string; after: string }, i: number) => (
                <DiffHunkView key={i} path={hunk.path} before={hunk.before} after={hunk.after} />
              ))}
            </div>
          )}

          {/* Test suggestions */}
          {proposal.tests && proposal.tests.length > 0 && (
            <div>
              <div className="mb-1 text-xs uppercase tracking-widest text-muted">Suggested Tests</div>
              {proposal.tests.map((t: string, i: number) => (
                <div key={i} className="rounded bg-[#09111f] px-2 py-1 text-xs text-text/70">{t}</div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              id={`proposal-accept-${index}`}
              disabled={blocked}
              onClick={() => !blocked && onAccept(proposal)}
              className="flex items-center gap-1.5 rounded-md bg-accent/20 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle className="size-3.5" />
              Accept
            </button>
            <button
              id={`proposal-reject-${index}`}
              onClick={() => onReject(index)}
              className="flex items-center gap-1.5 rounded-md bg-red-900/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/30"
            >
              <XCircle className="size-3.5" />
              Reject
            </button>
            {policy?.requiredApproval && (
              <span className="ml-auto text-xs text-amber-400">⚠ Requires approval</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AiSuggestions({
  explanation,
  suggestions,
  proposals = [],
  onAcceptProposal,
  onRejectProposal,
}: {
  explanation: InlineExplanation | null;
  suggestions: AiSuggestion[];
  proposals?: CodeProposal[];
  onAcceptProposal?: (proposal: CodeProposal) => void;
  onRejectProposal?: (index: number) => void;
}) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  function handleAccept(proposal: CodeProposal) {
    onAcceptProposal?.(proposal);
  }

  function handleReject(index: number) {
    setDismissed((prev) => new Set([...prev, index]));
    onRejectProposal?.(index);
  }

  const activeProposals = proposals.filter((_, i) => !dismissed.has(i));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-accent2" />
          AI suggestions
          {activeProposals.length > 0 && (
            <span className="ml-auto rounded-full bg-accent2/20 px-2 py-0.5 text-xs font-normal text-accent2">
              {activeProposals.length} proposal{activeProposals.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        {/* Inline explanation */}
        {explanation ? (
          <div className="rounded-md border border-line bg-[#10192e] p-3">
            <div className="text-sm font-medium text-text">{explanation.summary}</div>
            <div className="mt-2 text-sm text-muted">{explanation.insight}</div>
            {explanation.relatedSymbols.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {explanation.relatedSymbols.map((sym) => (
                  <span key={sym} className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-xs text-accent">
                    {sym}
                  </span>
                ))}
              </div>
            )}
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

        {/* Code proposals with diff preview */}
        {activeProposals.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-muted">Code Proposals</div>
            {activeProposals.map((proposal, i) => (
              <CodeProposalCard
                key={i}
                index={i}
                proposal={proposal}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        )}

        {/* Legacy heuristic suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            {activeProposals.length > 0 && (
              <div className="text-xs uppercase tracking-widest text-muted">Heuristic Suggestions</div>
            )}
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium text-text">{suggestion.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#09111f] px-1.5 py-0.5 text-xs text-muted">
                      {suggestion.source}
                    </span>
                    <div className="text-xs text-accent">{Math.round(suggestion.confidence * 100)}%</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted">{suggestion.details}</div>
                <pre className="mt-3 overflow-x-auto rounded bg-[#09111f] p-2 text-xs text-muted">{suggestion.code}</pre>
              </div>
            ))}
          </div>
        )}

        {!explanation && activeProposals.length === 0 && suggestions.length === 0 && (
          <div className="py-4 text-center text-xs text-muted">
            No suggestions — select a symbol or write code to get AI proposals.
          </div>
        )}
      </CardBody>
    </Card>
  );
}
