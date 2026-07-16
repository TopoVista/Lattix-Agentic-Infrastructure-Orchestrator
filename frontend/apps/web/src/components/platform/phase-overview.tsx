"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, ExternalLink, Search } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

type Phase = {
  phase: number; title: string; group: string; desc: string;
  implemented: boolean; modules: string[];
};

const GROUP_COLORS: Record<string, string> = {
  Foundation:     "border-l-[#7dd3fc] bg-[#7dd3fc]/10 text-[#7dd3fc]",
  Infrastructure: "border-l-[#a78bfa] bg-[#a78bfa]/10 text-[#a78bfa]",
  "AI Core":      "border-l-[#34d399] bg-[#34d399]/10 text-[#34d399]",
  Data:           "border-l-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]",
  Observability:  "border-l-[#60a5fa] bg-[#60a5fa]/10 text-[#60a5fa]",
  Reliability:    "border-l-[#f472b6] bg-[#f472b6]/10 text-[#f472b6]",
  Security:       "border-l-[#f87171] bg-[#f87171]/10 text-[#f87171]",
  Enterprise:     "border-l-[#fb923c] bg-[#fb923c]/10 text-[#fb923c]",
};

const GROUP_LINKS: Record<string, string> = {
  "AI Core":      "/platform/ai",
  Infrastructure: "/platform/infrastructure",
  Observability:  "/platform/observability",
  Reliability:    "/platform/reliability",
  Security:       "/platform/security",
  Data:           "/platform/data",
  Enterprise:     "/platform/enterprise",
};

export function PhaseOverview() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [filter, setFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/platform/phases")
      .then(r => r.json())
      .then(d => { setPhases(d.phases ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const groups = ["All", ...Array.from(new Set(phases.map(p => p.group)))];
  const visible = phases.filter(p =>
    (groupFilter === "All" || p.group === groupFilter) &&
    (filter === "" || p.title.toLowerCase().includes(filter.toLowerCase()) || p.desc.toLowerCase().includes(filter.toLowerCase()))
  );

  const implemented = phases.filter(p => p.implemented).length;
  const total = phases.length;

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardBody>
          <div className="text-xs uppercase tracking-widest text-muted">Total Phases</div>
          <div className="mt-2 text-3xl font-semibold text-accent">{total}</div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="text-xs uppercase tracking-widest text-muted">Implemented</div>
          <div className="mt-2 text-3xl font-semibold text-accent2">{implemented}</div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="text-xs uppercase tracking-widest text-muted">Coverage</div>
          <div className="mt-2 text-3xl font-semibold text-warning">
            {total > 0 ? Math.round((implemented / total) * 100) : 0}%
          </div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="text-xs uppercase tracking-widest text-muted">Phase Groups</div>
          <div className="mt-2 text-3xl font-semibold text-[#a78bfa]">{groups.length - 1}</div>
        </CardBody></Card>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-line bg-[#080f1e] p-4">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Implementation Progress — Phase 0 to Phase 40</span>
          <span>{implemented}/{total} phases</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#10192e] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-1000"
            style={{ width: `${total > 0 ? (implemented / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted" />
          <input
            value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="Search phases…"
            className="w-full rounded-lg border border-line bg-[#080f1e] pl-9 pr-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-accent/50"
          />
        </div>
        {groups.map(g => (
          <button key={g} onClick={() => setGroupFilter(g)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${groupFilter === g ? "bg-accent text-[#060d1a]" : "border border-line text-muted hover:text-text"}`}>
            {g}
          </button>
        ))}
      </div>

      {/* Phase grid */}
      {loading ? (
        <div className="py-12 text-center text-muted text-sm animate-pulse">Loading phase registry…</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visible.map(p => {
            const colorClass = GROUP_COLORS[p.group] ?? "border-l-muted";
            const link = GROUP_LINKS[p.group] ?? "/platform";
            return (
              <a key={p.phase} href={link}
                className={`group block rounded-xl border-l-4 border border-line bg-[#080f1e] p-4 hover:border-accent/40 transition-all ${colorClass.split(" ")[0]}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${colorClass}`}>
                      P{String(p.phase).padStart(2,"0")}
                    </span>
                    <span className="text-sm font-semibold text-text leading-tight">{p.title}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.implemented
                      ? <CheckCircle2 className="size-4 text-accent2" />
                      : <Circle className="size-4 text-muted/40" />}
                    <ExternalLink className="size-3.5 text-muted/0 group-hover:text-muted transition" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">{p.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-[10px] uppercase tracking-widest ${colorClass.split(" ")[2]}`}>{p.group}</span>
                  <span className={`text-[10px] font-medium ${p.implemented ? "text-accent2" : "text-muted/50"}`}>
                    {p.implemented ? "✓ Implemented" : "Planned"}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
