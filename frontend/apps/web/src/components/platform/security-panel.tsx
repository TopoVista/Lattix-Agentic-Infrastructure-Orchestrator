"use client";

import { Shield, ShieldAlert, Lock, Eye, FileCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const SECURITY_CHECKS = [
  { category: "Zero Trust", checks: [
    { name: "mTLS between all services", status: "pass" },
    { name: "RBAC enforcement", status: "pass" },
    { name: "Network policies applied", status: "pass" },
    { name: "Workload identity configured", status: "warn" },
  ]},
  { category: "Secrets Management", checks: [
    { name: "No hardcoded secrets", status: "pass" },
    { name: "Vault integration", status: "pass" },
    { name: "Secret rotation policy", status: "warn" },
    { name: "Audit logging enabled", status: "pass" },
  ]},
  { category: "Supply Chain", checks: [
    { name: "Dependency vulnerability scan", status: "pass" },
    { name: "Container image signing", status: "warn" },
    { name: "SBOM generated", status: "pass" },
    { name: "License compliance", status: "pass" },
  ]},
  { category: "Runtime Security", checks: [
    { name: "Seccomp profiles applied", status: "pass" },
    { name: "Read-only root filesystem", status: "pass" },
    { name: "Non-root containers", status: "pass" },
    { name: "Runtime anomaly detection", status: "warn" },
  ]},
];

const COMPLIANCE_CONTROLS = [
  { framework: "SOC 2 Type II", controls: 23, passing: 21, failing: 2 },
  { framework: "GDPR", controls: 18, passing: 17, failing: 1 },
  { framework: "ISO 27001", controls: 31, passing: 28, failing: 3 },
  { framework: "OWASP Top 10", controls: 10, passing: 10, failing: 0 },
];

const AUDIT_LOG = [
  { ts: "16:58:14", actor: "owner@lattix.io", action: "DELETE", resource: "task/task-123", result: "allowed" },
  { ts: "16:57:52", actor: "agent:code-reviewer", action: "READ", resource: "repo/main/src", result: "allowed" },
  { ts: "16:57:31", actor: "api-gateway", action: "RATE_LIMIT", resource: "/api/completions", result: "blocked" },
  { ts: "16:56:18", actor: "owner@lattix.io", action: "CREATE", resource: "workspace/new-project", result: "allowed" },
  { ts: "16:55:44", actor: "agent:ops-engineer", action: "EXEC", resource: "terminal/cmd", result: "audited" },
];

const StatusIcon = ({ s }: { s: string }) => s === "pass"
  ? <CheckCircle2 className="size-4 text-accent2 shrink-0" />
  : s === "warn" ? <Clock className="size-4 text-warning shrink-0" /> 
  : <XCircle className="size-4 text-danger shrink-0" />;

export function SecurityPanel() {
  const totalPass = SECURITY_CHECKS.flatMap(c => c.checks).filter(c => c.status === "pass").length;
  const totalWarn = SECURITY_CHECKS.flatMap(c => c.checks).filter(c => c.status === "warn").length;
  const totalFail = SECURITY_CHECKS.flatMap(c => c.checks).filter(c => c.status === "fail").length;
  const total = SECURITY_CHECKS.flatMap(c => c.checks).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-[#080f1e] p-3">
        {["P35 Security Hardening", "P36 Compliance & Audit", "P07 Authentication", "P06 API Gateway"].map(p => (
          <span key={p} className="rounded-md border border-[#f87171]/30 bg-[#f87171]/10 px-2 py-1 text-[10px] font-mono text-[#f87171]">{p}</span>
        ))}
      </div>

      {/* Summary */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card><CardBody>
          <div className="text-xs text-muted">Security Score</div>
          <div className="mt-1 text-2xl font-semibold text-accent2">{Math.round((totalPass / total) * 100)}%</div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="flex items-center gap-1.5 text-xs text-muted"><CheckCircle2 className="size-3 text-accent2"/>Passing</div>
          <div className="mt-1 text-2xl font-semibold text-accent2">{totalPass}</div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="flex items-center gap-1.5 text-xs text-muted"><Clock className="size-3 text-warning"/>Warnings</div>
          <div className="mt-1 text-2xl font-semibold text-warning">{totalWarn}</div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="flex items-center gap-1.5 text-xs text-muted"><XCircle className="size-3 text-danger"/>Failing</div>
          <div className="mt-1 text-2xl font-semibold text-danger">{totalFail}</div>
        </CardBody></Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Security checks */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><Shield className="size-4 text-[#f87171]"/>Security Controls</h3>
          {SECURITY_CHECKS.map(cat => (
            <Card key={cat.category}><CardHeader>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted">{cat.category}</div>
            </CardHeader><CardBody className="space-y-2">
              {cat.checks.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <StatusIcon s={c.status} />
                  <span className="text-sm text-text">{c.name}</span>
                </div>
              ))}
            </CardBody></Card>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Compliance */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3"><FileCheck className="size-4 text-[#a78bfa]"/>Compliance Frameworks</h3>
            <div className="space-y-2">
              {COMPLIANCE_CONTROLS.map(f => (
                <Card key={f.framework}><CardBody className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text">{f.framework}</span>
                    <span className={`text-sm font-semibold ${f.failing === 0 ? "text-accent2" : "text-warning"}`}>{f.passing}/{f.controls}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#10192e] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent" style={{width:`${(f.passing/f.controls)*100}%`}} />
                  </div>
                </CardBody></Card>
              ))}
            </div>
          </div>

          {/* Audit log */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3"><Eye className="size-4 text-accent"/>Audit Trail</h3>
            <Card><CardBody className="p-0">
              <div className="max-h-60 overflow-y-auto">
                {AUDIT_LOG.map((log, i) => (
                  <div key={i} className="flex gap-3 border-b border-line/40 px-3 py-2 text-xs hover:bg-[#080f1e]">
                    <span className="text-muted shrink-0">{log.ts}</span>
                    <span className="text-[#7dd3fc] shrink-0 w-36 truncate">{log.actor}</span>
                    <span className={`w-16 shrink-0 font-mono font-semibold ${log.action === "EXEC" ? "text-warning" : log.action === "DELETE" ? "text-danger" : "text-accent"}`}>{log.action}</span>
                    <span className="text-muted flex-1 truncate">{log.resource}</span>
                    <span className={`${log.result === "blocked" ? "text-danger" : log.result === "audited" ? "text-warning" : "text-accent2"}`}>{log.result}</span>
                  </div>
                ))}
              </div>
            </CardBody></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
