"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ActivitySquare, FileSearch, GitBranch, LayoutDashboard, MenuSquare, MessageSquareMore, Bell, CheckSquare, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/store";
import type { WorkspaceSummary } from "@/lib/types";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/repositories/repo-platform", label: "Repository", icon: FileSearch },
  { href: "/repositories/repo-platform?view=editor", label: "Editor", icon: ActivitySquare },
  { href: "/repositories/repo-platform?view=git", label: "Git", icon: GitBranch },
  { href: "/repositories/repo-platform?view=terminal", label: "Terminal", icon: Terminal },
  { href: "/repositories/repo-platform?view=docs", label: "Docs", icon: MessageSquareMore },
  { href: "/repositories/repo-platform?view=notifications", label: "Notifications", icon: Bell },
  { href: "/repositories/repo-platform?view=tasks", label: "Tasks", icon: CheckSquare }
];

export function WorkspaceShell({
  workspace,
  children
}: {
  workspace: WorkspaceSummary;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const selectedRepositoryId = useWorkspaceStore((state) => state.selectedRepositoryId);
  const [activeView, setActiveView] = useState("files");

  useEffect(() => {
    const search = typeof window !== "undefined" ? new URL(window.location.href).searchParams.get("view") : null;
    setActiveView(search ?? "files");
  }, [pathname]);

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="flex items-center justify-between border-b border-line bg-[#0d1428] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-md border border-line bg-panelSoft">
            <MenuSquare className="size-4 text-accent" />
          </div>
          <div>
            <div className="text-sm font-semibold">{workspace.name}</div>
            <div className="text-xs text-muted">Developer workspace</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Badge className="border-accent/40 text-accent">{workspace.role}</Badge>
          <span className="rounded-md border border-line px-3 py-2">Selected repo: {selectedRepositoryId}</span>
        </div>
      </header>
      <div className="grid min-h-[calc(100vh-57px)] grid-cols-[240px_1fr]">
        <aside className="border-r border-line bg-[#0c1224] p-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const view = item.href.includes("view=") ? item.href.split("view=")[1] : "files";
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith("/repositories/") && activeView === view;
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm text-muted hover:border-line hover:bg-panelSoft hover:text-text",
                    active && "border-accent/30 bg-panelSoft text-text"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="mt-4 rounded-lg border border-line bg-panel p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Workspace health</div>
            <div className="mt-2 text-2xl font-semibold">{workspace.health}</div>
            <div className="mt-1 text-sm text-muted">{workspace.activeProjects} projects, {workspace.activeRepositories} repositories</div>
          </div>
        </aside>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
