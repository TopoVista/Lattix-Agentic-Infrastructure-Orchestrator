"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ActivitySquare, FileSearch, GitBranch, LayoutDashboard, MenuSquare, MessageSquareMore, Bell, CheckSquare, Terminal, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/store";
import { AccountSwitcher } from "./account-switcher";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/repositories/repo-platform", label: "Repository", icon: FileSearch },
  { href: "/repositories/repo-platform?view=editor", label: "Editor", icon: ActivitySquare },
  { href: "/repositories/repo-platform?view=git", label: "Git", icon: GitBranch },
  { href: "/repositories/repo-platform?view=terminal", label: "Terminal", icon: Terminal },
  { href: "/repositories/repo-platform?view=docs", label: "Docs", icon: MessageSquareMore },
  { href: "/repositories/repo-platform?view=notifications", label: "Notifications", icon: Bell },
  { href: "/repositories/repo-platform?view=tasks", label: "Tasks", icon: CheckSquare },
];

const PLATFORM_NAV_ITEMS = [
  { href: "/platform", label: "Phase Overview", icon: Rocket },
  { href: "/platform/ai", label: "AI Core (P10–19)", icon: Rocket },
  { href: "/platform/infrastructure", label: "Infrastructure", icon: Rocket },
  { href: "/platform/observability", label: "Observability", icon: Rocket },
  { href: "/platform/digital-twin", label: "Digital Twin", icon: Rocket },
  { href: "/platform/data", label: "Data & ML", icon: Rocket },
  { href: "/platform/reliability", label: "Reliability", icon: Rocket },
  { href: "/platform/security", label: "Security", icon: Rocket },
  { href: "/platform/enterprise", label: "Enterprise", icon: Rocket },
];

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [activeView, setActiveView] = useState("files");

  const repos = useWorkspaceStore((s) => s.repos);
  const notifications = useWorkspaceStore((s) => s.notifications);
  const tasks = useWorkspaceStore((s) => s.tasks);
  const currentAccount = useWorkspaceStore((s) => s.currentAccount);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const openTaskCount = tasks.filter((t) => t.status !== "done").length;

  // Derive name from store — use first repo's name or fallback
  const workspaceName = "Lattix Platform";

  useEffect(() => {
    const search =
      typeof window !== "undefined"
        ? new URL(window.location.href).searchParams.get("view")
        : null;
    setActiveView(search ?? "files");
  }, [pathname]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-line bg-[#0d1428] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-md border border-line bg-panelSoft">
            <MenuSquare className="size-4 text-accent" />
          </div>
          <div>
            <div className="text-sm font-semibold">{workspaceName}</div>
            <div className="text-xs text-muted">{currentAccount().email}</div>
          </div>
        </div>
        <AccountSwitcher />
      </header>

      {/* Layout */}
      <div className="grid min-h-[calc(100vh-57px)] grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-line bg-[#0c1224] p-3 overflow-y-auto">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const view = item.href.includes("view=") ? item.href.split("view=")[1] : "files";
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith("/repositories/") && activeView === view;
              const Icon = item.icon;
              const badge =
                item.label === "Notifications" && unreadCount > 0
                  ? unreadCount
                  : item.label === "Tasks" && openTaskCount > 0
                  ? openTaskCount
                  : null;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm text-muted hover:border-line hover:bg-panelSoft hover:text-text",
                    active && "border-accent/30 bg-panelSoft text-text"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4" />
                    {item.label}
                  </div>
                  {badge !== null && (
                    <span className="rounded-full bg-warning/20 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                      {badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Platform Portal section */}
          <div className="mt-4">
            <div className="mb-1.5 px-3 text-[10px] uppercase tracking-[0.2em] text-muted/60 flex items-center gap-1.5">
              <Rocket className="size-3" /> Platform Portal
            </div>
            <nav className="space-y-0.5">
              {PLATFORM_NAV_ITEMS.map((item) => {
                const active = pathname === item.href || (item.href !== "/platform" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <a key={item.href} href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-transparent px-3 py-1.5 text-xs text-muted hover:border-line hover:bg-panelSoft hover:text-text",
                      active && "border-accent/30 bg-panelSoft text-accent"
                    )}>
                    <Icon className="size-3.5" />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Workspace health */}
          <div className="mt-4 rounded-lg border border-line bg-panel p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Workspace health</div>
            <div className="mt-2 text-2xl font-semibold text-accent2">ok</div>
            <div className="mt-1 text-sm text-muted">
              {repos.length} repos · {tasks.length} tasks
            </div>
          </div>
        </aside>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
