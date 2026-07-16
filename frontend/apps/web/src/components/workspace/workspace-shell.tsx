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

  const workspaceName = "Lattix Platform";

  useEffect(() => {
    const search =
      typeof window !== "undefined"
        ? new URL(window.location.href).searchParams.get("view")
        : null;
    setActiveView(search ?? "files");
  }, [pathname]);

  return (
    <div className="min-h-screen bg-transparent text-text">
      {/* Header */}
      <header className="sticky top-0 z-[40] flex items-center justify-between border-b border-line/30 bg-[#060913]/70 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl border border-accent/20 bg-accent/5 shadow-[0_0_15px_rgba(116,215,255,0.15)] text-accent animate-pulse">
            <MenuSquare className="size-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-accent bg-clip-text text-transparent">
              {workspaceName}
            </div>
            <div className="text-[10px] text-muted/80 font-mono tracking-wide mt-0.5">
              {currentAccount().email}
            </div>
          </div>
        </div>
        <AccountSwitcher />
      </header>

      {/* Layout */}
      <div className="grid min-h-[calc(100vh-69px)] grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-line/20 bg-[#060913]/40 backdrop-blur-md p-4 overflow-y-auto space-y-6">
          <div>
            <div className="mb-2 px-3 text-[10px] uppercase tracking-[0.2em] text-muted/50 font-bold">
              Workspace
            </div>
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
                      "flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-muted hover:bg-panelSoft/30 hover:text-text transition-all duration-200",
                      active && "border-accent/20 bg-panelSoft/60 text-accent shadow-[0_2px_10px_rgba(116,215,255,0.05)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("size-3.5", active ? "text-accent" : "text-muted")} />
                      {item.label}
                    </div>
                    {badge !== null && (
                      <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[9px] font-mono font-bold text-warning shadow-[0_0_8px_rgba(255,209,102,0.2)]">
                        {badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Platform Portal section */}
          <div>
            <div className="mb-2 px-3 text-[10px] uppercase tracking-[0.2em] text-muted/50 font-bold flex items-center gap-1.5">
              <Rocket className="size-3 text-accent" /> Platform Portal
            </div>
            <nav className="space-y-1">
              {PLATFORM_NAV_ITEMS.map((item) => {
                const active = pathname === item.href || (item.href !== "/platform" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-muted hover:bg-panelSoft/30 hover:text-text transition-all duration-200",
                      active && "border-accent/20 bg-panelSoft/60 text-accent shadow-[0_2px_10px_rgba(116,215,255,0.05)]"
                    )}
                  >
                    <Icon className={cn("size-3.5", active ? "text-accent" : "text-muted")} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Workspace health */}
          <div className="rounded-xl border border-line/20 bg-panelSoft/20 p-4 shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted/60 font-bold">
              Workspace Status
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
              </span>
              <span className="text-sm font-bold text-accent2 text-glow-accent2">Operational</span>
            </div>
            <div className="mt-1.5 text-xs text-muted/80 font-mono">
              {repos.length} repos · {tasks.length} tasks
            </div>
          </div>
        </aside>

        <main className="p-6 overflow-y-auto max-h-[calc(100vh-69px)] bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
