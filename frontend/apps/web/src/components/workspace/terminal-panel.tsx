"use client";

import { TerminalSquare, ShieldAlert, ClipboardList } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { TerminalSessionPolicy } from "@/lib/types";

export function TerminalPanel({ policy }: { policy: TerminalSessionPolicy }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <TerminalSquare className="size-4 text-warning" />
          Terminal
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="rounded-md border border-line bg-[#09111f] p-4 font-mono text-sm text-muted">
          <div className="text-accent">$ terminal session request</div>
          <div className="mt-2">{policy.reason}</div>
          <div className="mt-3 text-xs text-muted">Mode: {policy.mode} | Audit: {policy.auditId}</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Detail label="Allowed" value={policy.allowed ? "yes" : "no"} icon={<ShieldAlert className="size-4 text-danger" />} />
          <Detail label="Expires" value={policy.expiresAt} icon={<ClipboardList className="size-4 text-accent2" />} />
        </div>
      </CardBody>
    </Card>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-[#10192e] p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-text">{value}</div>
    </div>
  );
}
