"use client";

import { Search } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { RepositoryIntelligenceIndex } from "@lattix/code-intelligence";
import { searchRepositoryIndex } from "@lattix/code-intelligence";

export function RepositorySearchPanel({
  index,
  query
}: {
  index: RepositoryIntelligenceIndex | null;
  query: string;
}) {
  const results = index ? searchRepositoryIndex(index, query) : { symbols: [], files: [], dependencies: [], references: [] };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Search className="size-4 text-accent" />
          Repository search
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="text-xs uppercase tracking-[0.16em] text-muted">{query || "Type a search query above"}</div>
        <ResultGroup label="Symbols" items={results.symbols.map((symbol) => symbol.name)} />
        <ResultGroup label="Files" items={results.files} />
        <ResultGroup label="Dependencies" items={results.dependencies} />
        <ResultGroup label="References" items={results.references.map((reference) => reference.preview)} />
      </CardBody>
    </Card>
  );
}

function ResultGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.16em] text-muted">{label}</div>
      {items.length ? (
        <div className="space-y-2">
          {items.slice(0, 4).map((item) => (
            <div key={item} className="rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text">
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-line bg-[#09111f] px-3 py-2 text-sm text-muted">No matches</div>
      )}
    </div>
  );
}
