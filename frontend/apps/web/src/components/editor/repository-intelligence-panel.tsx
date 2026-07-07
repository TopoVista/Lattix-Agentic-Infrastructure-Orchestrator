"use client";

import { useMemo, useState } from "react";
import { Cpu, GitCommitHorizontal, Network, Table2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RepositoryGraphBundle, RepositoryIntelligenceGraphType } from "@lattix/code-intelligence";
import { cn } from "@/lib/utils";

const graphLabels: Record<RepositoryIntelligenceGraphType, { label: string; icon: React.ReactNode }> = {
  ast: { label: "AST", icon: <Cpu className="size-3.5" /> },
  cfg: { label: "CFG", icon: <Network className="size-3.5" /> },
  dfg: { label: "DFG", icon: <Network className="size-3.5" /> },
  ssa: { label: "SSA", icon: <GitCommitHorizontal className="size-3.5" /> },
  call: { label: "Call", icon: <GitCommitHorizontal className="size-3.5" /> },
  dependency: { label: "Dependency", icon: <Network className="size-3.5" /> },
  api: { label: "API", icon: <Network className="size-3.5" /> },
  package: { label: "Package", icon: <GitCommitHorizontal className="size-3.5" /> },
  database: { label: "Database", icon: <Table2 className="size-3.5" /> }
};

export function RepositoryIntelligencePanel({ bundle }: { bundle: RepositoryGraphBundle | null }) {
  const graphTypes = useMemo(() => (bundle ? (Object.keys(bundle.graphs) as RepositoryIntelligenceGraphType[]) : []), [bundle]);
  const [activeType, setActiveType] = useState<RepositoryIntelligenceGraphType>("dependency");
  const graph = bundle?.graphs[activeType] ?? null;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold">Repository intelligence</div>
          {bundle ? (
            <div className="flex flex-wrap gap-2">
              <Badge>{bundle.repositoryId}</Badge>
              <Badge>{bundle.commit}</Badge>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {graphTypes.map((type) => {
            const meta = graphLabels[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition",
                  activeType === type ? "border-accent/50 bg-[#17223d] text-text" : "border-line bg-[#10192e] text-muted hover:text-text"
                )}
              >
                {meta.icon}
                {meta.label}
              </button>
            );
          })}
        </div>

        {graph ? (
          <>
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              <Badge>{graph.nodes.length} nodes</Badge>
              <Badge>{graph.edges.length} edges</Badge>
              <Badge>{graph.name}</Badge>
            </div>
            <div className="space-y-2">
              {graph.nodes.slice(0, 6).map((node) => (
                <div key={node.id} className="rounded-md border border-line bg-[#10192e] p-3">
                  <div className="text-sm font-medium text-text">{node.label}</div>
                  <div className="mt-1 text-xs text-muted">
                    {node.kind} · {node.id}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-line bg-[#09111f] p-3 font-mono text-xs text-muted">
              {graph.edges.slice(0, 10).map((edge) => `${edge.from} -> ${edge.to} (${edge.label})`).join("\n")}
            </div>
          </>
        ) : (
          <div className="rounded-md border border-dashed border-line bg-[#09111f] p-3 text-sm text-muted">Repository intelligence will populate after the index is ready.</div>
        )}
      </CardBody>
    </Card>
  );
}
