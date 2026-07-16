"use client";

import { Cpu, GitBranch, CheckCircle2, Clock, XCircle, Cloud, Server, Globe } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const CICD_PIPELINES = [
  { name: "lattix-platform / main", branch: "main", status: "success", duration: "4m 12s", steps: ["lint","test","build","scan","deploy"], lastRun: "2 min ago" },
  { name: "lattix-agents / workspace-ui", branch: "workspace-ui", status: "running", duration: "2m 08s", steps: ["lint","test","build","scan"], lastRun: "running" },
  { name: "ai-platform / code-completion", branch: "feature/streaming", status: "success", duration: "1m 55s", steps: ["test","build","push"], lastRun: "15 min ago" },
  { name: "services / auth-service", branch: "fix/token-refresh", status: "failed", duration: "0m 48s", steps: ["lint","test"], lastRun: "28 min ago" },
];

const CLOUD_RESOURCES = [
  { cloud: "AWS", region: "us-east-1", resources: [
    { type: "EKS Cluster", name: "lattix-prod", status: "active", cost: "$340/mo" },
    { type: "RDS PostgreSQL", name: "lattix-db-prod", status: "active", cost: "$180/mo" },
    { type: "ElastiCache", name: "lattix-redis-prod", status: "active", cost: "$120/mo" },
    { type: "MSK Kafka", name: "lattix-kafka-prod", status: "active", cost: "$240/mo" },
    { type: "S3 Bucket", name: "lattix-data-prod", status: "active", cost: "$45/mo" },
  ]},
  { cloud: "GCP", region: "us-central1", resources: [
    { type: "GKE Cluster", name: "lattix-ml-cluster", status: "active", cost: "$280/mo" },
    { type: "BigQuery", name: "lattix-analytics", status: "active", cost: "$60/mo" },
  ]},
];

const DR_STATUS = [
  { name: "Backup PostgreSQL", rto: "< 15min", rpo: "< 1hr", last: "2 hours ago", status: "ok" },
  { name: "Backup Kafka offsets", rto: "< 5min", rpo: "< 5min", last: "30 min ago", status: "ok" },
  { name: "Cross-region S3 replication", rto: "< 1min", rpo: "< 1min", last: "live", status: "ok" },
  { name: "Neo4j snapshot", rto: "< 30min", rpo: "< 4hr", last: "6 hours ago", status: "warn" },
];

const StepBadge = ({ step, active }: { step: string; active: boolean }) => (
  <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${active ? "bg-warning/20 text-warning animate-pulse" : "bg-accent2/20 text-accent2"}`}>{step}</span>
);

export function InfrastructurePanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-[#080f1e] p-3">
        {["P03 Cloud Infra","P04 Kubernetes","P05 Backend","P06 API Gateway","P07 Auth","P24 Cloud Controllers","P25 CI/CD","P32 Disaster Recovery","P33 Multi-Region"].map(p => (
          <span key={p} className="rounded-md border border-[#a78bfa]/30 bg-[#a78bfa]/10 px-2 py-1 text-[10px] font-mono text-[#a78bfa]">{p}</span>
        ))}
      </div>

      {/* CI/CD */}
      <Card><CardHeader><div className="flex items-center gap-2 text-sm font-semibold"><GitBranch className="size-4 text-[#a78bfa]"/>CI/CD Pipelines (Phase 25)</div></CardHeader>
        <CardBody className="space-y-3">
          {CICD_PIPELINES.map(p => (
            <div key={p.name} className="rounded-lg border border-line bg-[#080f1e] p-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {p.status === "success" ? <CheckCircle2 className="size-4 text-accent2 shrink-0" /> : p.status === "running" ? <Clock className="size-4 text-warning shrink-0 animate-spin" /> : <XCircle className="size-4 text-danger shrink-0" />}
                  <span className="text-sm font-medium text-text">{p.name}</span>
                  <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">{p.branch}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{p.duration}</span>
                  <span>{p.lastRun}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.steps.map((step, i) => <StepBadge key={step} step={step} active={p.status === "running" && i === p.steps.length - 1} />)}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Cloud Resources */}
      <Card><CardHeader><div className="flex items-center gap-2 text-sm font-semibold"><Cloud className="size-4 text-[#7dd3fc]"/>Cloud Resources (Phase 24)</div></CardHeader>
        <CardBody className="space-y-4">
          {CLOUD_RESOURCES.map(cloud => (
            <div key={cloud.cloud}>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-widest">
                <Globe className="size-3" />{cloud.cloud} · {cloud.region}
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {cloud.resources.map(r => (
                  <div key={r.name} className="flex items-center justify-between rounded-lg border border-line bg-[#080f1e] px-3 py-2">
                    <div>
                      <div className="text-[10px] text-muted uppercase">{r.type}</div>
                      <div className="text-sm font-mono text-text">{r.name}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-accent2 text-[10px]">{r.status}</span>
                      <div className="text-xs text-muted">{r.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Disaster Recovery */}
      <Card><CardHeader><div className="flex items-center gap-2 text-sm font-semibold"><Server className="size-4 text-[#f87171]"/>Disaster Recovery (Phase 32)</div></CardHeader>
        <CardBody className="space-y-2">
          {DR_STATUS.map(dr => (
            <div key={dr.name} className="flex items-center gap-3 rounded-lg border border-line bg-[#080f1e] px-4 py-3">
              {dr.status === "ok" ? <CheckCircle2 className="size-4 text-accent2 shrink-0" /> : <Clock className="size-4 text-warning shrink-0" />}
              <div className="flex-1">
                <div className="text-sm font-medium text-text">{dr.name}</div>
                <div className="text-[11px] text-muted">Last: {dr.last}</div>
              </div>
              <div className="text-right text-xs text-muted">
                <div>RTO: <span className="text-accent2">{dr.rto}</span></div>
                <div>RPO: <span className="text-accent2">{dr.rpo}</span></div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
