"use client";

import { Search, Target } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { CodeSymbol } from "@lattix/code-intelligence";

export function SymbolSearch({
  query,
  onQueryChange,
  symbols,
  activeSymbolName,
  onSelectSymbol
}: {
  query: string;
  onQueryChange: (value: string) => void;
  symbols: CodeSymbol[];
  activeSymbolName: string | null;
  onSelectSymbol: (symbol: CodeSymbol) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Search className="size-4 text-accent" />
          Symbol search
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search symbols, signatures, or paths"
          className="w-full rounded-md border border-line bg-[#09111f] px-3 py-2 text-sm text-text outline-none placeholder:text-muted focus:border-accent/60"
        />
        <div className="space-y-2">
          {symbols.length ? (
            symbols.map((symbol) => (
              <button
                key={`${symbol.path}:${symbol.name}`}
                type="button"
                onClick={() => onSelectSymbol(symbol)}
                className={`w-full rounded-md border px-3 py-2 text-left transition ${
                  activeSymbolName === symbol.name ? "border-accent/50 bg-[#17223d]" : "border-line bg-[#10192e] hover:border-accent/30"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-text">
                  <Target className="size-3.5 text-accent2" />
                  {symbol.name}
                </div>
                <div className="mt-1 text-xs text-muted">{symbol.signature}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">
                  {symbol.kind} · {symbol.path}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-line bg-[#09111f] p-3 text-sm text-muted">No symbols match the current query.</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
