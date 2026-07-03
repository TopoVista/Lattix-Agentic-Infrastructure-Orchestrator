"use client";

import { Link2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { ReferenceLocation } from "@lattix/code-intelligence";

export function ReferencePanel({
  symbolName,
  references
}: {
  symbolName: string | null;
  references: ReferenceLocation[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link2 className="size-4 text-accent2" />
          References
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="text-xs uppercase tracking-[0.16em] text-muted">{symbolName ?? "No symbol selected"}</div>
        {references.length ? (
          references.map((reference) => (
            <div key={`${reference.path}:${reference.line}:${reference.column}`} className="rounded-md border border-line bg-[#10192e] p-3">
              <div className="text-sm font-medium text-text">{reference.path}</div>
              <div className="mt-1 text-xs text-muted">
                line {reference.line}, column {reference.column}
              </div>
              <div className="mt-2 rounded bg-[#09111f] px-2 py-1 font-mono text-xs text-muted">{reference.preview}</div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-dashed border-line bg-[#09111f] p-3 text-sm text-muted">No references found yet. Search for a symbol to populate this panel.</div>
        )}
      </CardBody>
    </Card>
  );
}
