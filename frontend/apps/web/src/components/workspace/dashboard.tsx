"use client";

import { useState } from "react";
import { ArrowRight, Bell, CircleDot, FolderGit2, MessageSquareMore, PlaySquare, ShieldAlert, SquareTerminal, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-line bg-[#0c1224] p-6 shadow-2xl">
        <h2 className="mb-4 text-base font-semibold text-text">Add Repository</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted">Name *</label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="my-repo" className="w-full rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-accent/60" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="What this repo is for…" className="w-full rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-accent/60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted">Provider</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value as RepositorySummary["provider"])}
                className="w-full rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text outline-none">
                {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">URL (optional)</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/…" className="w-full rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-accent/60" />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-line px-3 py-2 text-sm text-muted hover:text-text">Cancel</button>
          <button onClick={submit} disabled={!name.trim()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#060d1a] hover:bg-accent/90 disabled:opacity-40">
            Add Repository
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
      <div className="space-y-4">
        {/* Stat cards */}
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Projects" value={12} tone="accent" />
          <StatCard label="Repositories" value={repos.length} tone="green" />
          <StatCard label="Open Tasks" value={openTasks} tone="warn" />
          <StatCard label="Notifications" value={unread} tone="danger" />
        </section>

        <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          {/* Repos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Repositories</div>
                  <div className="text-xs text-muted">Connect, browse, and inspect workspace sources.</div>
                </div>
                <button
                  onClick={() => setShowAddRepo(true)}
                  className="flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
                >
                  <Plus className="size-3.5" /> Add
                </button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {repos.map((repo) => (
                <div key={repo.id} className="group flex items-start justify-between rounded-md border border-line bg-[#121a31] p-3 hover:border-accent/40">
                  <button onClick={() => setRepository(repo.id)} className="flex flex-1 items-start gap-2 text-left">
                    <FolderGit2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    <div>
                      <div className="font-medium text-text">{repo.name}</div>
                      <div className="mt-0.5 text-sm text-muted">{repo.description}</div>
                      <div className="mt-1 text-xs text-muted/60">{repo.provider} · {repo.status}</div>
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-1 ml-2">
                    <a href={`/repositories/${repo.id}`} className="rounded p-1 text-muted hover:text-accent" title="Open"><ArrowRight className="size-4" /></a>
                    <button onClick={() => deleteRepo(repo.id)} className="hidden group-hover:block rounded p-1 text-muted hover:text-danger" title="Remove">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {repos.length === 0 && (
                <p className="py-4 text-center text-sm text-muted">No repositories. Add one above.</p>
              )}
            </CardBody>
          </Card>

          {/* Workspace status */}
          <Card>
            <CardHeader><div className="text-sm font-semibold">Workspace status</div></CardHeader>
            <CardBody className="space-y-4">
              <div className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="flex items-center gap-2 text-sm"><SquareTerminal className="size-4 text-accent2" /> Terminal</div>
                <div className="mt-2 text-sm text-accent2 font-medium">Enabled — open the Terminal tab</div>
              </div>
              <div className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="flex items-center gap-2 text-sm"><ShieldAlert className="size-4 text-accent2" /> Health</div>
                <div className="mt-2 text-sm text-muted">All core workspace surfaces connected.</div>
              </div>
              <div className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="text-xs uppercase tracking-[0.16em] text-muted mb-2">Task progress</div>
                <div className="flex gap-2 text-xs">
                  <span className="text-muted">{tasks.filter(t=>t.status==="done").length}/{tasks.length} done</span>
                  <span className="text-warning">{tasks.filter(t=>t.status==="blocked").length} blocked</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
          {/* Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <PlaySquare className="size-4 text-accent2" /> Activity
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {activity.length === 0 && <p className="text-sm text-muted">No activity yet.</p>}
              {activity.map((item) => (
                <div key={item.id} className="rounded-md border border-line bg-[#10192e] p-3">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="mt-1 text-sm text-muted">{item.detail}</div>
                  <div className="mt-2 text-xs text-muted">{item.time}</div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Notifications preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bell className="size-4 text-warning" /> Notifications
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="rounded-md border border-line bg-[#10192e] p-3">
                  <div className="flex items-center gap-2">
                    <CircleDot className={`size-3 ${n.read ? "text-muted/40" : "text-accent"}`} />
                    <div className="text-sm font-medium">{n.title}</div>
                  </div>
                  <div className="mt-1 text-sm text-muted">{n.body}</div>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-sm text-muted">No notifications.</p>}
            </CardBody>
          </Card>

          {/* Docs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquareMore className="size-4 text-accent" /> Docs
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {[
                { title: "Workspace Overview", href: "/docs/workspace", kind: "readme" },
                { title: "Repository Contract", href: "/docs/repositories", kind: "spec" },
                { title: "Developer Workflow ADR", href: "/docs/adr/developer-workspace", kind: "adr" },
              ].map((doc) => (
                <a key={doc.title} href={doc.href} className="block rounded-md border border-line bg-[#10192e] p-3 hover:border-accent/40">
                  <div className="text-sm font-medium">{doc.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{doc.kind}</div>
                </a>
              ))}
            </CardBody>
          </Card>
        </section>
      </div>
    </>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "accent" | "green" | "warn" | "danger" }) {
  const toneClass = tone === "accent" ? "text-accent" : tone === "green" ? "text-accent2" : tone === "warn" ? "text-warning" : "text-danger";
  return (
    <Card>
      <CardBody>
        <div className="text-xs uppercase tracking-[0.18em] text-muted">{label}</div>
        <div className={`mt-2 text-3xl font-semibold ${toneClass}`}>{value}</div>
      </CardBody>
    </Card>
  );
}
