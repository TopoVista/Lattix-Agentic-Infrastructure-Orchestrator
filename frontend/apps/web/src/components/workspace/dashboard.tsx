"use client";

import { useState } from "react";
import { ArrowRight, Bell, CircleDot, FolderGit2, MessageSquareMore, PlaySquare, ShieldAlert, SquareTerminal, Plus, Trash2, X, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useWorkspaceStore } from "@/lib/store";
import type { RepositorySummary } from "@/lib/types";

const PROVIDERS: RepositorySummary["provider"][] = ["github", "gitlab", "bitbucket", "local"];

function AddRepoModal({ onClose }: { onClose: () => void }) {
  const addRepo = useWorkspaceStore((s) => s.addRepo);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState<RepositorySummary["provider"]>("github");
  const [url, setUrl] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    addRepo({ name: name.trim(), description: description.trim(), provider, url: url.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-line/45 bg-[#0c1224]/90 backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-text bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Connect Repository</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-panelSoft hover:text-text transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Repository Name *</label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="my-cool-project" className="w-full rounded-xl border border-line/40 bg-[#10192e]/60 px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none focus:border-accent/60" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="What this repository is for…" className="w-full rounded-xl border border-line/40 bg-[#10192e]/60 px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none focus:border-accent/60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Provider</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value as RepositorySummary["provider"])}
                className="w-full rounded-xl border border-line/40 bg-[#10192e]/60 px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent/60">
                {PROVIDERS.map((p) => <option key={p} value={p} className="bg-[#0c1224]">{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">URL (optional)</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/…" className="w-full rounded-xl border border-line/40 bg-[#10192e]/60 px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none focus:border-accent/60" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button onClick={onClose} className="rounded-xl border border-line/40 px-4 py-2.5 text-sm text-muted hover:text-text transition-colors">Cancel</button>
          <button onClick={submit} disabled={!name.trim()}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-[#060d1a] hover:bg-accent/90 disabled:opacity-40 transition-colors shadow-[0_2px_12px_rgba(116,215,255,0.15)] glow-btn">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceDashboardView() {
  const repos = useWorkspaceStore((s) => s.repos);
  const tasks = useWorkspaceStore((s) => s.tasks);
  const notifications = useWorkspaceStore((s) => s.notifications);
  const setRepository = useWorkspaceStore((s) => s.setRepository);
  const deleteRepo = useWorkspaceStore((s) => s.deleteRepo);

  const [showAddRepo, setShowAddRepo] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;
  const openTasks = tasks.filter((t) => t.status !== "done").length;

  const activity = [
    ...tasks.slice(-2).map((t) => ({ id: t.id, title: "Task updated", detail: `"${t.title}" — ${t.status.replace("_", " ")}`, time: new Date(t.updatedAt).toLocaleTimeString() })),
    ...repos.slice(-2).map((r) => ({ id: r.id, title: "Repository connected", detail: r.name, time: new Date(r.lastIndexedAt).toLocaleTimeString() })),
  ].slice(0, 4);

  return (
    <>
      {showAddRepo && <AddRepoModal onClose={() => setShowAddRepo(false)} />}
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Workspace Dashboard</h1>
            <p className="text-xs text-muted/80 font-mono mt-1">LATTIX ENGINE SYSTEM OVERVIEW</p>
          </div>
          <button
            onClick={() => setShowAddRepo(true)}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-[#060d1a] hover:bg-accent/90 transition-all shadow-[0_2px_15px_rgba(116,215,255,0.18)] glow-btn"
          >
            <Plus className="size-4" /> Connect Repository
          </button>
        </div>

        {/* Stat cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Projects" value={12} tone="accent" desc="Active orchestrator runs" />
          <StatCard label="Repositories" value={repos.length} tone="green" desc="Indexed code paths" />
          <StatCard label="Open Tasks" value={openTasks} tone="warn" desc="Assigned engineering items" />
          <StatCard label="Notifications" value={unread} tone="danger" desc="Unread alerts pending" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          {/* Repos */}
          <Card>
            <CardHeader className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-text">Workspace Repositories</h3>
                <p className="text-xs text-muted/70 mt-0.5">Manage and inspect connected repository paths.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-3 pt-3">
              {repos.map((repo) => (
                <div key={repo.id} className="group flex items-center justify-between rounded-xl border border-line/30 bg-[#10192e]/40 p-4 hover:border-accent/40 hover:bg-[#10192e]/60 transition-all duration-200 shadow-sm">
                  <button onClick={() => setRepository(repo.id)} className="flex flex-1 items-center gap-3.5 text-left min-w-0">
                    <div className="grid size-10 place-items-center rounded-xl border border-accent/20 bg-accent/5 text-accent group-hover:scale-105 transition-transform duration-200">
                      <FolderGit2 className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-text truncate">{repo.name}</div>
                      <div className="text-xs text-muted/80 truncate mt-0.5">{repo.description || "No description provided."}</div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-muted/60 font-mono">
                        <span className="uppercase">{repo.provider}</span>
                        <span>•</span>
                        <span className="text-accent2">{repo.status}</span>
                      </div>
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-1.5 ml-3">
                    <a href={`/repositories/${repo.id}`} className="rounded-xl border border-line/40 p-2 text-muted hover:text-accent hover:border-accent/30 hover:bg-panelSoft/30 transition-all" title="Open"><ArrowRight className="size-4" /></a>
                    <button onClick={() => deleteRepo(repo.id)} className="hidden group-hover:block rounded-xl border border-line/45 p-2 text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all" title="Remove">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
              {repos.length === 0 && (
                <div className="py-8 text-center text-xs text-muted font-mono">No repositories configured. Click "Connect Repository" above.</div>
              )}
            </CardBody>
          </Card>

          {/* Workspace status */}
          <Card>
            <CardHeader><h3 className="text-sm font-bold text-text">Workspace Engine Health</h3></CardHeader>
            <CardBody className="space-y-4">
              <div className="rounded-xl border border-line/30 bg-[#10192e]/40 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-accent2"><SquareTerminal className="size-4" /> Terminal Endpoint</div>
                <div className="mt-2 text-xs text-muted leading-relaxed">Shell execution layer active and sandboxed. Terminal is accessible inside repository views.</div>
              </div>
              <div className="rounded-xl border border-line/30 bg-[#10192e]/40 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-accent"><ShieldAlert className="size-4" /> Global Guards</div>
                <div className="mt-2 text-xs text-muted leading-relaxed">Command blocklists loaded. Read/write file API routes reporting operational.</div>
              </div>
              <div className="rounded-xl border border-line/30 bg-[#10192e]/40 p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted/60 font-bold mb-2">Task board completion</div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-accent2">{tasks.filter(t=>t.status==="done").length}/{tasks.length} Resolved</span>
                  {tasks.filter(t=>t.status==="blocked").length > 0 && (
                    <span className="text-warning font-bold">{tasks.filter(t=>t.status==="blocked").length} Blocked</span>
                  )}
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[#10192e] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent2 rounded-full transition-all duration-500"
                    style={{ width: `${tasks.length > 0 ? (tasks.filter(t=>t.status==="done").length / tasks.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Activity */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted font-bold">
                <Activity className="size-4 text-accent2" /> Recent Activity
              </h3>
            </CardHeader>
            <CardBody className="space-y-3 pt-2">
              {activity.length === 0 && <p className="text-xs text-muted font-mono py-4 text-center">No recent events logged.</p>}
              {activity.map((item) => (
                <div key={item.id} className="rounded-xl border border-line/30 bg-[#10192e]/30 p-3.5 space-y-1">
                  <div className="text-xs font-bold text-text flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-[9px] text-muted/65 font-mono">{item.time}</span>
                  </div>
                  <div className="text-xs text-muted/80 leading-relaxed font-mono">{item.detail}</div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Notifications preview */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted font-bold">
                <Bell className="size-4 text-warning" /> Live Notifications
              </h3>
            </CardHeader>
            <CardBody className="space-y-3 pt-2">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="rounded-xl border border-line/30 bg-[#10192e]/30 p-3.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <CircleDot className={cn("size-3 shrink-0", n.read ? "text-muted/40" : "text-accent text-glow-accent")} />
                    <div className="text-xs font-bold text-text">{n.title}</div>
                  </div>
                  <div className="text-xs text-muted/80 leading-relaxed pl-5 font-mono">{n.body}</div>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-xs text-muted font-mono py-4 text-center">No new notifications.</p>}
            </CardBody>
          </Card>

          {/* Docs */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted font-bold">
                <MessageSquareMore className="size-4 text-accent" /> Reference Portal
              </h3>
            </CardHeader>
            <CardBody className="space-y-3 pt-2">
              {[
                { title: "Workspace Overview Guide", href: "/docs/workspace", kind: "README" },
                { title: "Repository Sync Contract", href: "/docs/repositories", kind: "SPECIFICATION" },
                { title: "Developer Workflow Strategy", href: "/docs/adr/developer-workspace", kind: "ADR DECISION" },
              ].map((doc) => (
                <a key={doc.title} href={doc.href} className="block rounded-xl border border-line/30 bg-[#10192e]/30 p-3.5 hover:border-accent/40 hover:bg-[#10192e]/60 transition-all">
                  <div className="text-xs font-bold text-text">{doc.title}</div>
                  <div className="mt-1 text-[9px] font-mono tracking-wider text-accent/80 uppercase">{doc.kind}</div>
                </a>
              ))}
            </CardBody>
          </Card>
        </section>
      </div>
    </>
  );
}

function StatCard({ label, value, tone, desc }: { label: string; value: number; tone: "accent" | "green" | "warn" | "danger"; desc: string }) {
  const toneClass = tone === "accent" ? "text-accent text-glow-accent" : tone === "green" ? "text-accent2 text-glow-accent2" : tone === "warn" ? "text-warning" : "text-danger";
  const barColor = tone === "accent" ? "bg-accent" : tone === "green" ? "bg-accent2" : tone === "warn" ? "bg-warning" : "bg-danger";
  return (
    <Card className="relative overflow-hidden group">
      {/* Top accent line */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", barColor)} />
      <CardBody className="p-5 flex flex-col justify-between min-h-[110px]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted/70 font-bold">{label}</div>
          <div className="text-xs text-muted/50 mt-0.5">{desc}</div>
        </div>
        <div className={`text-4xl font-extrabold tracking-tight mt-3 ${toneClass}`}>{value}</div>
      </CardBody>
    </Card>
  );
}
