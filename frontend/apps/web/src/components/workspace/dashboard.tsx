"use client";

import { ArrowRight, Bell, CircleDot, FolderGit2, MessageSquareMore, PlaySquare, ShieldAlert, SquareTerminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useWorkspaceStore } from "@/lib/store";
import type { WorkspaceDashboard } from "@/lib/types";

export function WorkspaceDashboardView({ dashboard }: { dashboard: WorkspaceDashboard }) {
  const setRepository = useWorkspaceStore((state) => state.setRepository);

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Projects" value={dashboard.workspace.activeProjects} tone="accent" />
        <StatCard label="Repositories" value={dashboard.workspace.activeRepositories} tone="green" />
        <StatCard label="Tasks" value={dashboard.workspace.openTasks} tone="warn" />
        <StatCard label="Notifications" value={dashboard.workspace.notifications} tone="danger" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Repositories</div>
                <div className="text-xs text-muted">Connect, browse, and inspect workspace sources.</div>
              </div>
              <Badge>{dashboard.selectedRepository.provider}</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {dashboard.repositories.map((repo) => (
              <button
                key={repo.id}
                onClick={() => setRepository(repo.id)}
                className="flex w-full items-start justify-between rounded-md border border-line bg-[#121a31] p-3 text-left hover:border-accent/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="size-4 text-accent" />
                    <span className="font-medium">{repo.name}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted">{repo.description}</div>
                </div>
                <ArrowRight className="size-4 text-muted" />
              </button>
            ))}
            <a href="/repositories/repo-platform" className="inline-flex items-center gap-2 rounded-md border border-line bg-panelSoft px-3 py-2 text-sm font-medium text-text transition hover:border-accent/60 hover:bg-[#1b2847]">
              Open repository <ArrowRight className="size-4" />
            </a>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Workspace status</div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="rounded-md border border-line bg-[#10192e] p-3">
              <div className="flex items-center gap-2 text-sm">
                <SquareTerminal className="size-4 text-warning" />
                Terminal policy
              </div>
              <div className="mt-2 text-sm text-muted">{dashboard.terminalPolicy.reason}</div>
            </div>
            <div className="rounded-md border border-line bg-[#10192e] p-3">
              <div className="flex items-center gap-2 text-sm">
                <ShieldAlert className="size-4 text-danger" />
                Health summary
              </div>
              <div className="mt-2 text-sm text-muted">{dashboard.workspace.health === "ok" ? "All core workspace surfaces are connected." : "Some workspace surfaces need attention."}</div>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <PlaySquare className="size-4 text-accent2" />
              Activity
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {dashboard.activity.map((item) => (
              <div key={item.id} className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="mt-1 text-sm text-muted">{item.detail}</div>
                <div className="mt-2 text-xs text-muted">{item.time}</div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bell className="size-4 text-warning" />
              Notifications
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {dashboard.notifications.map((item) => (
              <div key={item.id} className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="flex items-center gap-2">
                  <CircleDot className="size-3 text-accent" />
                  <div className="text-sm font-medium">{item.title}</div>
                </div>
                <div className="mt-1 text-sm text-muted">{item.body}</div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquareMore className="size-4 text-accent" />
              Docs
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {dashboard.docs.map((doc) => (
              <a key={doc.title} href={doc.href} className="block rounded-md border border-line bg-[#10192e] p-3 hover:border-accent/40">
                <div className="text-sm font-medium">{doc.title}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{doc.kind}</div>
              </a>
            ))}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "accent" | "green" | "warn" | "danger" }) {
  const toneClass =
    tone === "accent" ? "text-accent" : tone === "green" ? "text-accent2" : tone === "warn" ? "text-warning" : "text-danger";
  return (
    <Card>
      <CardBody>
        <div className="text-xs uppercase tracking-[0.18em] text-muted">{label}</div>
        <div className={`mt-2 text-3xl font-semibold ${toneClass}`}>{value}</div>
      </CardBody>
    </Card>
  );
}
