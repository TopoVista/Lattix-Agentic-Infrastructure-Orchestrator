"use client";

import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { Diagnostic } from "@lattix/code-intelligence";

export function DiagnosticsPanel({ diagnostics }: { diagnostics: Diagnostic[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ShieldAlert className="size-4 text-warning" />
          Diagnostics
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        {diagnostics.length ? (
          diagnostics.map((diagnostic) => (
            <div key={`${diagnostic.code}:${diagnostic.message}`} className="rounded-md border border-line bg-[#10192e] p-3">
              <div className="flex items-start gap-2">
                {diagnostic.severity === "error" ? (
                  <AlertTriangle className="mt-0.5 size-4 text-danger" />
                ) : (
                  <Info className="mt-0.5 size-4 text-accent" />
                )}
                <div>
                  <div className="text-sm font-medium text-text">{diagnostic.message}</div>
                  <div className="mt-1 text-xs text-muted">
                    {diagnostic.source} · {diagnostic.path} · {diagnostic.code}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-dashed border-line bg-[#09111f] p-3 text-sm text-muted">No diagnostics were generated for this file.</div>
        )}
      </CardBody>
    </Card>
  );
}
