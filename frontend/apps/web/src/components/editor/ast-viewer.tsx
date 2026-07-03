"use client";

import { ChevronDown, FileCode2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { ParseTreeNode, ParseTreeSnapshot } from "@lattix/code-intelligence";
import { cn } from "@/lib/utils";

export function AstViewer({ snapshot }: { snapshot: ParseTreeSnapshot | null }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <FileCode2 className="size-4 text-accent" />
          Parse tree
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{snapshot?.language ?? "unknown"}</span>
          <span>{snapshot ? `${snapshot.durationMs} ms` : "pending"}</span>
        </div>
        {snapshot ? (
          <TreeNode node={snapshot.rootNode} depth={0} />
        ) : (
          <div className="rounded-md border border-dashed border-line bg-[#09111f] p-3 text-sm text-muted">Parse tree will appear after the editor loads a file.</div>
        )}
        {snapshot?.errors.length ? (
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.16em] text-warning">Tree warnings</div>
            {snapshot.errors.map((error) => (
              <div key={error} className="rounded-md border border-warning/30 bg-warning/10 p-2 text-sm text-text">
                {error}
              </div>
            ))}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

function TreeNode({ node, depth }: { node: ParseTreeNode; depth: number }) {
  return (
    <div className="space-y-1">
      <div
        className={cn("flex items-start gap-2 rounded-md border border-line bg-[#10192e] p-2 text-sm", depth > 0 && "ml-4")}
        style={{ marginLeft: `${depth * 12}px` }}
      >
        <ChevronDown className="mt-0.5 size-3.5 text-muted" />
        <div className="min-w-0">
          <div className="font-medium text-text">{node.kind}</div>
          <div className="truncate text-xs text-muted">{node.text}</div>
        </div>
      </div>
      {node.children.map((child) => (
        <TreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
