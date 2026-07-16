"use client";

import { Zap, FlaskConical, Globe, Shield, BarChart3, Activity, BookOpen, CheckCircle2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useState } from "react";

const CHAOS_EXPERIMENTS = [
  { name: "Pod termination — auth-service", target: "auth-service/prod", type: "pod-kill", status: "completed", result: "recovered in 8s", safe: true },
  { name: "Network partition — DB", target: "postgres/primary", type: "network", status: "scheduled", result: "—", safe: true },
  { name: "CPU throttle — agent-runtime", target: "agent-runtime/prod", type: "cpu-stress", status: "completed", result: "degraded, no outage", safe: true },
  { name: "Kafka broker kill", target: "kafka/broker-2", type: "process-kill", status: "completed", result: "rebalanced in 12s", safe: true },
];

const PERF_BENCHMARKS = [
  { name: "API Gateway throughput", target: "10k RPS", achieved: "12.4k RPS", status: "pass" },
  { name: "Code completion p99", target: "< 2s", achieved: "1.2s", status: "pass" },
  { name: "Knowledge graph query p99", target: "< 100ms", achieved: "87ms", status: "pass" },
  { name: "Agent dispatch p50", target: "< 300ms", achieved: "284ms", status: "pass" },
  { name: "DB write throughput", target: "5k TPS", achieved: "4.8k TPS", status: "warn" },
  { name: "Memory recall p50", target: "< 50ms", achieved: "43ms", status: "pass" },
];

const READINESS_GATES = [
  { category: "Performance", passed: 5, total: 6 },
  { category: "Security", passed: 4, total: 4 },
  { category: "Compliance", passed: 3, total: 4 },
  { category: "Reliability", passed: 6, total: 6 },
  { category: "Observability", passed: 4, total: 4 },
  { category: "Documentation", passed: 2, total: 3 },
  { category: "DR/RTO/RPO", passed: 3, total: 3 },
  { category: "Cost Targets", passed: 2, total: 2 },
];

export function ReliabilityPanel() {
  const [chaosTarget, setChaosTarget] = useState("");
  const [chaosRan, setChaosRan] = useState(false);

  const totalGates = READINESS_GATES.reduce((s, g) => s + g.total, 0);
  const passedGates = READINESS_GATES.reduce((s, g) => s + g.passed, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-[#080f1e] p-3">
        {["P28 Caching","P29 DB Scaling","P30 Traffic Control","P31 Service Mesh","P32 DR","P33 Multi-Region","P34 Chaos Engineering","P37 Performance","P40 Production Readiness"].map(p => (
          <span key={p} className="rounded-md border border-[#f472b6]/30 bg-[#f472b6]/10 px-2 py-1 text-[10px] font-mono text-[#f472b6]">{p}</span>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Chaos Engineering */}
        <Card><CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold"><FlaskConical className="size-4 text-[#f472b6]"/>Chaos Engineering (Phase 34)</div>
        </CardHeader><CardBody className="space-y-3">
          {CHAOS_EXPERIMENTS.map(exp => (
            <div key={exp.name} className="rounded-lg border border-line bg-[#080f1e] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-text">{exp.name}</div>
                  <div className="text-[11px] text-muted mt-0.5">Target: {exp.target} · Type: {exp.type}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${exp.status === "completed" ? "bg-accent2/20 text-accent2" : "bg-warning/20 text-warning"}`}>{exp.status}</span>
              </div>
              {exp.result !== "—" && <div className="mt-1.5 text-[11px] text-accent2">{exp.result}</div>}
            </div>
          ))}
          <div className="rounded-lg border border-dashed border-[#f472b6]/40 p-3">
            <div className="text-[11px] text-muted mb-2">Run custom chaos experiment:</div>
            <div className="flex gap-2">
              <input value={chaosTarget} onChange={e => setChaosTarget(e.target.value)}
                placeholder="e.g. pod-kill auth-service"
                className="flex-1 rounded-md border border-line bg-[#080f1e] px-2 py-1.5 text-xs text-text placeholder:text-muted outline-none" />
              <button onClick={() => { if (chaosTarget) { setChaosRan(true); setTimeout(() => setChaosRan(false), 3000); } }}
                className="rounded-md border border-[#f472b6]/40 bg-[#f472b6]/10 px-3 py-1.5 text-xs text-[#f472b6] hover:bg-[#f472b6]/20">
                {chaosRan ? "✓ Simulated" : "Simulate"}
              </button>
            </div>
          </div>
        </CardBody></Card>

        {/* Performance */}
        <Card><CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold"><BarChart3 className="size-4 text-[#7dd3fc]"/>Performance Benchmarks (Phase 37)</div>
        </CardHeader><CardBody className="space-y-2">
          {PERF_BENCHMARKS.map(b => (
            <div key={b.name} className="flex items-center gap-3 rounded-lg border border-line bg-[#080f1e] px-3 py-2">
              <CheckCircle2 className={`size-4 shrink-0 ${b.status === "pass" ? "text-accent2" : "text-warning"}`} />
              <div className="flex-1">
                <div className="text-xs font-medium text-text">{b.name}</div>
                <div className="text-[10px] text-muted">Target: {b.target}</div>
              </div>
              <span className={`text-sm font-semibold ${b.status === "pass" ? "text-accent2" : "text-warning"}`}>{b.achieved}</span>
            </div>
          ))}
        </CardBody></Card>
      </div>

      {/* Production Readiness */}
      <Card><CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="size-4 text-accent2"/>Production Readiness Score (Phase 40)</div>
          <span className="text-lg font-bold text-accent2">{Math.round((passedGates / totalGates) * 100)}%</span>
        </div>
      </CardHeader><CardBody>
        <div className="mb-4 h-2 rounded-full bg-[#10192e] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all" style={{width: `${(passedGates/totalGates)*100}%`}} />
        </div>
        <div className="grid gap-2 md:grid-cols-4">
          {READINESS_GATES.map(g => (
            <div key={g.category} className={`rounded-lg border p-3 ${g.passed === g.total ? "border-accent2/30 bg-accent2/5" : "border-warning/30 bg-warning/5"}`}>
              <div className="text-[10px] uppercase tracking-widest text-muted">{g.category}</div>
              <div className={`mt-1 text-xl font-semibold ${g.passed === g.total ? "text-accent2" : "text-warning"}`}>{g.passed}/{g.total}</div>
            </div>
          ))}
        </div>
      </CardBody></Card>
    </div>
  );
}
