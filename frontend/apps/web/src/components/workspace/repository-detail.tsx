"use client";

import { EditorWorkspace } from "../editor/editor-workspace";
import { GitPanel } from "./git-panel";
import { DocsPanel } from "./docs-panel";
import { NotificationsPanel } from "./notifications-panel";
import { TaskBoard } from "./task-board";
import { RepositoryBrowser } from "./repository-browser";
import { TerminalPanel } from "./terminal-panel";
import type { WorkspaceDashboard } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RepositoryDetail({ dashboard, view }: { dashboard: WorkspaceDashboard; view?: string }) {
  const panel = view ?? "files";
  const tabs = [
    { id: "files", label: "Files" },
    { id: "editor", label: "Editor" },
    { id: "git", label: "Git" },
    { id: "terminal", label: "Terminal" },
    { id: "docs", label: "Docs" },
    { id: "notifications", label: "Notifications" },
    { id: "tasks", label: "Tasks" }
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-lg border border-line bg-panel p-2">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`/repositories/${dashboard.selectedRepository.id}${tab.id === "files" ? "" : `?view=${tab.id}`}`}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition",
              panel === tab.id ? "bg-[#17223d] text-text" : "text-muted hover:bg-panelSoft hover:text-text"
            )}
          >
            {tab.label}
          </a>
        ))}
      </div>
      {panel === "files" ? <RepositoryBrowser repository={dashboard.selectedRepository} tree={dashboard.fileTree} fileContent={dashboard.fileContent} /> : null}
      {panel === "editor" ? <EditorWorkspace repository={dashboard.selectedRepository} tree={dashboard.fileTree} /> : null}
      {panel === "git" ? <GitPanel branches={dashboard.branches} commits={dashboard.recentCommits} /> : null}
      {panel === "terminal" ? <TerminalPanel policy={dashboard.terminalPolicy} /> : null}
      {panel === "docs" ? <DocsPanel docs={dashboard.docs} /> : null}
      {panel === "notifications" ? <NotificationsPanel notifications={dashboard.notifications} /> : null}
      {panel === "tasks" ? <TaskBoard tasks={dashboard.tasks} /> : null}
    </div>
  );
}
