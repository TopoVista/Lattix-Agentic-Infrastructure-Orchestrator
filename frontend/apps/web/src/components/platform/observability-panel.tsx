"use client";

import { useEffect, useState } from "react";
import { Activity, BarChart3, FileText, Layers, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const STATUS_BADGE = ({ s }: { s: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${s === "collecting" || s === "active" ? "bg-[#60a5fa]/20 text-[#60a5fa]" : "bg-muted/20 text-muted"}`}>
    {s === "collecting" && <span className="size-1.5 rounded-full bg-[#60a5fa] inline-block animate-pulse" />}
    {s}
  </span>
);

const MOCK_METRICS = [
  { name: "http_requests_total", value: "1,247,891", delta: "+3.2%", unit: "req" },
  { name: "http_latency_p99", value: "142ms", delta: "-8ms", unit: "ms" },
  { name: "error_rate", value: "0.012%", delta: "-0.003%", unit: "%" },
  { name: "cpu_usage_avg", value: "34.2%", delta: "+1.1%", unit: "%" },
  { name: "memory_rss_gb", value: "2.8 GB", delta: "+0.1 GB", unit: "GB" },
  { name: "kafka_lag_sum", value: "124", delta: "-31", unit: "msgs" },
  { name: "db_connections", value: "48/200", delta: "stable", unit: "conn" },
  { name: "cache_hit_rate", value: "96.4%", delta: "+0.4%", unit: "%" },
];

const MOCK_LOGS = [
  { level: "INFO", ts: "16:58:12.341", service: "auth-service", msg: "User login successful: user@lattix.io" },
  { level: "INFO", ts: "16:58:11.204", service: "workspace-svc", msg: "Repository indexed: lattix-platform (98% coverage)" },
  { level: "WARN", ts: "16:58:10.887", service: "kafka", msg: "Consumer lag elevated: topic=events partition=2 lag=124" },
  { level: "INFO", ts: "16:58:09.002", service: "agent-runtime", msg: "Agent dispatched: role=code-reviewer task=pr-review-441" },
  { level: "INFO", ts: "16:58:07.551", service: "knowledge-graph", msg: "Graph update committed: 3 nodes, 7 edges added" },
  { level: "ERROR", ts: "16:58:06.123", service: "ml-platform", msg: "Model inference timeout after 5000ms — retrying" },
  { level: "INFO", ts: "16:58:04.889", service: "memory-svc", msg: "Long-term memory checkpoint saved: 1,204 facts" },
  { level: "INFO", ts: "16:58:03.221", service: "mcp-server", msg: "Tool call: web-search completed in 312ms" },
];

const MOCK_TRACES = [
  { id: "abc123", op: "POST /api/agents/dispatch", duration: "284ms", spans: 12, status: "ok" },
  { id: "def456", op: "GET /api/knowledge-graph/query", duration: "87ms", spans: 5, status: "ok" },
  { id: "ghi789", op: "POST /api/code-completion/generate", duration: "1,203ms", spans: 18, status: "ok" },
  { id: "jkl012", op: "GET /api/repos/lattix-platform/index", duration: "5,012ms", spans: 34, status: "slow" },
  { id: "mno345", op: "POST /api/memory/recall", duration: "43ms", spans: 3, status: "ok" },
];

const ALERTS = [
  { name: "KafkaConsumerLagHigh", severity: "warning", since: "5m ago", desc: "Consumer lag > 100 on events topic" },
  { name: "ModelInferenceTimeout", severity: "warning", since: "2m ago", desc: "ML model inference exceeded timeout threshold" },
  { name: "DatabaseConnectionsHigh", severity: "info", since: "10m ago", desc: "DB connections at 24% of max capacity" },
];

export function ObservabilityPanel() {
  const [systems, setSystems] = useState<{observability: {modules: string[]; alerts: string[]; dashboards: string[]; status: string}} | null>(null);
  const [tab, setTab] = useState<"metrics"|"logs"|"traces"|"alerts">("metrics");

  useEffect(() => {
    fetch("/api/platform/systems").then(r => r.json()).then(d => setSystems(d));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-[#080f1e] p-3">
        {["P26 Observability"].map(p => (
          <span key={p} className="rounded-md border border-[#60a5fa]/30 bg-[#60a5fa]/10 px-2 py-1 text-[10px] font-mono text-[#60a5fa]">{p}</span>
        ))}
        <span className="ml-auto text-xs text-muted flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent2 inline-block animate-pulse" />
          OTel collector active · Prometheus scraping · Grafana at :3000
        </span>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Active Alerts", value: ALERTS.length, icon: AlertTriangle, color: "text-warning" },
          { label: "Python Modules", value: systems?.observability.modules.length ?? 0, icon: Layers, color: "text-[#60a5fa]" },
          { label: "Alert Rules", value: systems?.observability.alerts.length ?? 0, icon: Activity, color: "text-accent2" },
          { label: "Dashboards", value: (systems?.observability.dashboards.length ?? 0) + 4, icon: BarChart3, color: "text-[#a78bfa]" },
        ].map(s => (
          <Card key={s.label}><CardBody>
            <div className="flex items-center gap-2">
              <s.icon className={`size-4 ${s.color}`} />
              <span className="text-xs text-muted">{s.label}</span>
            </div>
            <div className={`mt-2 text-2xl font-semibold ${s.color}`}>{s.value}</div>
          </CardBody></Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-line bg-[#080f1e] p-1">
        {(["metrics","logs","traces","alerts"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize transition ${tab === t ? "bg-accent text-[#060d1a]" : "text-muted hover:text-text"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Metrics */}
      {tab === "metrics" && (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {MOCK_METRICS.map(m => (
            <Card key={m.name}><CardBody className="p-3">
              <div className="font-mono text-[10px] text-muted truncate">{m.name}</div>
              <div className="mt-1 text-xl font-semibold text-text">{m.value}</div>
              <div className={`mt-1 text-xs ${m.delta.startsWith("+") ? "text-accent2" : m.delta.startsWith("-") && m.name.includes("error") ? "text-accent2" : m.delta.startsWith("-") ? "text-danger" : "text-muted"}`}>{m.delta}</div>
            </CardBody></Card>
          ))}
        </div>
      )}

      {/* Logs */}
      {tab === "logs" && (
        <Card><CardBody className="p-0">
          <div className="max-h-96 overflow-y-auto bg-[#060d1a] rounded-lg font-mono text-xs">
            {MOCK_LOGS.map((log, i) => (
              <div key={i} className={`flex gap-3 border-b border-line/40 px-4 py-2 ${log.level === "ERROR" ? "bg-danger/5" : log.level === "WARN" ? "bg-warning/5" : ""}`}>
                <span className={`w-12 shrink-0 font-semibold ${log.level === "ERROR" ? "text-danger" : log.level === "WARN" ? "text-warning" : "text-accent2"}`}>{log.level}</span>
                <span className="text-muted w-24 shrink-0">{log.ts}</span>
                <span className="text-[#60a5fa] w-28 shrink-0 truncate">{log.service}</span>
                <span className="text-text">{log.msg}</span>
              </div>
            ))}
          </div>
        </CardBody></Card>
      )}

      {/* Traces */}
      {tab === "traces" && (
        <Card><CardBody className="space-y-2">
          {MOCK_TRACES.map(t => (
            <div key={t.id} className="flex items-center gap-3 rounded-lg border border-line bg-[#080f1e] px-4 py-3">
              <code className="text-[10px] text-muted w-14 shrink-0">{t.id}</code>
              <span className="flex-1 text-sm text-text font-mono truncate">{t.op}</span>
              <span className="text-xs text-muted">{t.spans} spans</span>
              <span className={`text-sm font-medium w-20 text-right ${t.status === "slow" ? "text-warning" : "text-accent2"}`}>{t.duration}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${t.status === "ok" ? "bg-accent2/20 text-accent2" : "bg-warning/20 text-warning"}`}>{t.status}</span>
            </div>
          ))}
        </CardBody></Card>
      )}

      {/* Alerts */}
      {tab === "alerts" && (
        <div className="space-y-2">
          {ALERTS.map(a => (
            <Card key={a.name}><CardBody className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`mt-0.5 size-4 shrink-0 ${a.severity === "warning" ? "text-warning" : "text-[#60a5fa]"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text">{a.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${a.severity === "warning" ? "bg-warning/20 text-warning" : "bg-[#60a5fa]/20 text-[#60a5fa]"}`}>{a.severity}</span>
                    <span className="text-xs text-muted ml-auto">{a.since}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{a.desc}</p>
                </div>
              </div>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
