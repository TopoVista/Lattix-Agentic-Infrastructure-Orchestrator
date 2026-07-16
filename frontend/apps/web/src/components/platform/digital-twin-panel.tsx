"use client";

import { useEffect, useState } from "react";
import { GitMerge, Server, Box, TrendingUp, AlertTriangle, Code, Database, Cloud } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const STATUS_BADGE = ({ s }: { s: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${s === "syncing" ? "bg-warning/20 text-warning" : "bg-accent2/20 text-accent2"}`}>
    <span className={`size-1.5 rounded-full inline-block animate-pulse ${s === "syncing" ? "bg-warning" : "bg-accent2"}`} />
    {s}
  </span>
);

const SYSTEM_NODES = [
  { id: "frontend", label: "Next.js Web", type: "ui", status: "healthy", version: "15.5.20", deps: ["api-gateway"] },
  { id: "api-gateway", label: "API Gateway", type: "service", status: "healthy", version: "1.0.0", deps: ["auth-service","workspace-svc","agent-runtime"] },
  { id: "auth-service", label: "Auth Service", type: "service", status: "healthy", version: "1.0.0", deps: ["postgres","redis"] },
  { id: "workspace-svc", label: "Workspace Svc", type: "service", status: "healthy", version: "1.0.0", deps: ["postgres","kafka"] },
  { id: "agent-runtime", label: "Agent Runtime", type: "ai", status: "healthy", version: "1.0.0", deps: ["kafka","knowledge-graph","memory","mcp-server"] },
  { id: "knowledge-graph", label: "Knowledge Graph", type: "ai", status: "healthy", version: "1.0.0", deps: ["neo4j"] },
  { id: "memory", label: "Memory System", type: "ai", status: "healthy", version: "1.0.0", deps: ["qdrant","redis"] },
  { id: "mcp-server", label: "MCP Server", type: "tool", status: "healthy", version: "1.0.0", deps: [] },
  { id: "postgres", label: "PostgreSQL 16", type: "data", status: "healthy", version: "16", deps: [] },
  { id: "redis", label: "Redis 7", type: "data", status: "healthy", version: "7", deps: [] },
  { id: "kafka", label: "Kafka 3.9", type: "data", status: "healthy", version: "3.9.0", deps: [] },
  { id: "neo4j", label: "Neo4j 5", type: "data", status: "healthy", version: "5", deps: [] },
  { id: "qdrant", label: "Qdrant", type: "data", status: "planned", version: "latest", deps: [] },
  { id: "minio", label: "MinIO", type: "data", status: "healthy", version: "latest", deps: [] },
];

const COST_DATA = [
  { resource: "Compute (K8s)", monthly: 1240, optimized: 890, saving: 350 },
  { resource: "Database (RDS)", monthly: 680, optimized: 520, saving: 160 },
  { resource: "Storage (S3/MinIO)", monthly: 180, optimized: 145, saving: 35 },
  { resource: "Network (egress)", monthly: 320, optimized: 280, saving: 40 },
  { resource: "AI/ML Inference", monthly: 890, optimized: 640, saving: 250 },
  { resource: "Kafka Streaming", monthly: 240, optimized: 200, saving: 40 },
];

const TYPE_COLORS: Record<string, string> = {
  ui: "border-[#7dd3fc]/40 bg-[#7dd3fc]/10 text-[#7dd3fc]",
  service: "border-[#a78bfa]/40 bg-[#a78bfa]/10 text-[#a78bfa]",
  ai: "border-[#34d399]/40 bg-[#34d399]/10 text-[#34d399]",
  tool: "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]",
  data: "border-[#60a5fa]/40 bg-[#60a5fa]/10 text-[#60a5fa]",
};

export function DigitalTwinPanel() {
  const [systems, setSystems] = useState<{digitalTwin: {modules: string[]; views: string[]; status: string; description: string}} | null>(null);
  const [selectedNode, setSelectedNode] = useState<typeof SYSTEM_NODES[0] | null>(null);
  const [view, setView] = useState<"topology"|"cost"|"incidents">("topology");

  useEffect(() => {
    fetch("/api/platform/systems").then(r => r.json()).then(d => setSystems(d));
  }, []);

  const totalMonthly = COST_DATA.reduce((s, c) => s + c.monthly, 0);
  const totalSaving = COST_DATA.reduce((s, c) => s + c.saving, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center rounded-xl border border-line bg-[#080f1e] p-3">
        <span className="rounded-md border border-[#f472b6]/30 bg-[#f472b6]/10 px-2 py-1 text-[10px] font-mono text-[#f472b6]">P27 Digital Twin</span>
        <span className="rounded-md border border-[#fb923c]/30 bg-[#fb923c]/10 px-2 py-1 text-[10px] font-mono text-[#fb923c]">P38 Cost Optimization</span>
        <STATUS_BADGE s={systems?.digitalTwin.status ?? "loading"} />
        <span className="ml-2 text-xs text-muted">{systems?.digitalTwin.description}</span>
      </div>

      {/* View selector */}
      <div className="flex gap-1 rounded-lg border border-line bg-[#080f1e] p-1">
        {(["topology","cost","incidents"] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize transition ${view === v ? "bg-accent text-[#060d1a]" : "text-muted hover:text-text"}`}>
            {v === "topology" ? "System Topology" : v === "cost" ? "Cost Model" : "Incident History"}
          </button>
        ))}
      </div>

      {/* Topology view */}
      {view === "topology" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
          <Card><CardHeader><div className="text-sm font-semibold flex items-center gap-2"><GitMerge className="size-4 text-[#f472b6]"/>Live System Topology</div></CardHeader>
            <CardBody>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {SYSTEM_NODES.map(node => (
                  <button key={node.id} onClick={() => setSelectedNode(node)}
                    className={`rounded-lg border-2 p-3 text-left transition ${selectedNode?.id === node.id ? "border-accent" : "border-transparent"} ${TYPE_COLORS[node.type]}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{node.label}</span>
                      <span className={`size-2 rounded-full ${node.status === "healthy" ? "bg-accent2" : "bg-muted"}`} />
                    </div>
                    <div className="mt-1 text-[10px] opacity-70">v{node.version} · {node.type}</div>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
          {selectedNode && (
            <Card><CardHeader><div className="text-sm font-semibold">{selectedNode.label}</div></CardHeader>
              <CardBody className="space-y-3 text-sm">
                <div><span className="text-muted">Type:</span> <span className="text-text capitalize">{selectedNode.type}</span></div>
                <div><span className="text-muted">Version:</span> <span className="text-text">{selectedNode.version}</span></div>
                <div><span className="text-muted">Status:</span> <span className={selectedNode.status === "healthy" ? "text-accent2" : "text-muted"}>{selectedNode.status}</span></div>
                {selectedNode.deps.length > 0 && (
                  <div>
                    <div className="text-muted mb-1">Dependencies:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.deps.map(d => <span key={d} className="rounded border border-line bg-[#080f1e] px-1.5 py-0.5 text-[10px] text-muted">{d}</span>)}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* Cost view */}
      {view === "cost" && (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <Card><CardBody>
              <div className="text-xs text-muted">Current Monthly Cost</div>
              <div className="mt-1 text-2xl font-semibold text-warning">${totalMonthly.toLocaleString()}</div>
            </CardBody></Card>
            <Card><CardBody>
              <div className="text-xs text-muted">Optimized Estimate</div>
              <div className="mt-1 text-2xl font-semibold text-accent2">${(totalMonthly - totalSaving).toLocaleString()}</div>
            </CardBody></Card>
            <Card><CardBody>
              <div className="text-xs text-muted">Potential Savings</div>
              <div className="mt-1 text-2xl font-semibold text-accent">${totalSaving.toLocaleString()} / mo</div>
            </CardBody></Card>
          </div>
          <Card><CardBody className="space-y-2">
            {COST_DATA.map(c => (
              <div key={c.resource} className="rounded-lg border border-line bg-[#080f1e] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text">{c.resource}</span>
                  <span className="text-xs text-accent2">Save ${c.saving}/mo</span>
                </div>
                <div className="flex gap-2 items-center text-xs text-muted">
                  <span className="text-warning">${c.monthly}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#10192e] overflow-hidden">
                    <div className="h-full rounded-full bg-accent2" style={{width: `${(c.optimized / c.monthly) * 100}%`}} />
                  </div>
                  <span className="text-accent2">${c.optimized}</span>
                </div>
              </div>
            ))}
          </CardBody></Card>
        </div>
      )}

      {/* Incidents */}
      {view === "incidents" && (
        <Card><CardBody className="space-y-3">
          {[
            { id: "INC-001", title: "Kafka lag spike", severity: "P2", status: "resolved", duration: "14m", service: "kafka", resolvedBy: "AI Ops Agent" },
            { id: "INC-002", title: "Auth service 5xx surge", severity: "P1", status: "resolved", duration: "3m", service: "auth-service", resolvedBy: "On-call engineer" },
            { id: "INC-003", title: "Memory service OOM", severity: "P2", status: "resolved", duration: "22m", service: "memory", resolvedBy: "AI Ops Agent + auto-scaling" },
            { id: "INC-004", title: "Neo4j slow queries", severity: "P3", status: "mitigated", duration: "ongoing", service: "neo4j", resolvedBy: "Index optimization queued" },
          ].map(inc => (
            <div key={inc.id} className="flex items-start gap-3 rounded-lg border border-line bg-[#080f1e] p-3">
              <AlertTriangle className={`mt-0.5 size-4 shrink-0 ${inc.severity === "P1" ? "text-danger" : inc.severity === "P2" ? "text-warning" : "text-[#60a5fa]"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-muted">{inc.id}</span>
                  <span className="text-sm font-medium text-text">{inc.title}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${inc.severity === "P1" ? "bg-danger/20 text-danger" : inc.severity === "P2" ? "bg-warning/20 text-warning" : "bg-[#60a5fa]/20 text-[#60a5fa]"}`}>{inc.severity}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${inc.status === "resolved" ? "bg-accent2/20 text-accent2" : "bg-warning/20 text-warning"}`}>{inc.status}</span>
                </div>
                <div className="mt-1 text-xs text-muted">{inc.service} · {inc.duration} · {inc.resolvedBy}</div>
              </div>
            </div>
          ))}
        </CardBody></Card>
      )}
    </div>
  );
}
