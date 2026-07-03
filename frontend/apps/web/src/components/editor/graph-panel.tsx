"use client";

import { GitBranch, Workflow } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { CodeGraphSnapshot } from "@lattix/code-intelligence";

export function GraphPanel({ graph }: { graph: CodeGraphSnapshot | null }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Workflow className="size-4 text-accent" />
          Code graph
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        {graph ? (
          <>
            <div className="text-xs uppercase tracking-[0.16em] text-muted">{graph.name}</div>
            <div className="space-y-2">
              {graph.nodes.map((node) => (
                <div key={node.id} className="rounded-md border border-line bg-[#10192e] p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-text">
                    <GitBranch className="size-4 text-accent2" />
                    {node.label}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    {node.kind} · {node.id}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-line bg-[#09111f] p-3 font-mono text-xs text-muted">
              {graph.edges.map((edge) => `${edge.from} -> ${edge.to} (${edge.label})`).join("\n")}
            </div>
          </>
        ) : (
          <div className="rounded-md border border-dashed border-line bg-[#09111f] p-3 text-sm text-muted">The repository graph will appear after the current file is analyzed.</div>
        )}
      </CardBody>
    </Card>
  );
}
