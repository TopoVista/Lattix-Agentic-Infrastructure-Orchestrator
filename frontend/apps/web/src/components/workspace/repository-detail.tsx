"use client";

import { EditorWorkspace } from "../editor/editor-workspace";
import { GitPanel } from "./git-panel";
import { DocsPanel } from "./docs-panel";
import { NotificationsPanel } from "./notifications-panel";
import { TaskBoard } from "./task-board";
import { RepositoryBrowser } from "./repository-browser";
import { TerminalPanel } from "./terminal-panel";
import { useWorkspaceStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { dashboard } from "@/lib/mock-data";

export function RepositoryDetail({ view }: { view?: string }) {
  const panel = view ?? "files";
  const repos = useWorkspaceStore((s) => s.repos);
  const selectedRepositoryId = useWorkspaceStore((s) => s.selectedRepositoryId);
  const selectedRepo = repos.find((r) => r.id === selectedRepositoryId) ?? repos[0] ?? dashboard.selectedRepository;

  const tabs = [
    { id: "files", label: "Files" },
    { id: "editor", label: "Editor" },
    { id: "git", label: "Git" },
    { id: "terminal", label: "Terminal" },
    { id: "docs", label: "Docs" },
    { id: "notifications", label: "Notifications" },
    { id: "tasks", label: "Tasks" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 rounded-lg border border-line bg-panel p-2">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`/repositories/${selectedRepo?.id ?? "repo-platform"}${tab.id === "files" ? "" : `?view=${tab.id}`}`}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition",
              panel === tab.id ? "bg-[#17223d] text-text" : "text-muted hover:bg-panelSoft hover:text-text"
            )}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {panel === "files" && selectedRepo && (
        <RepositoryBrowser
          repository={selectedRepo}
          tree={dashboard.fileTree}
          fileContent={dashboard.fileContent}
        />
      )}
      {panel === "editor" && selectedRepo && (
        <EditorWorkspace repository={selectedRepo} tree={dashboard.fileTree} />
      )}
      {panel === "git" && <GitPanel />}
      {panel === "terminal" && <TerminalPanel />}
      {panel === "docs" && <DocsPanel docs={dashboard.docs} />}
      {panel === "notifications" && <NotificationsPanel />}
      {panel === "tasks" && <TaskBoard />}
    </div>
  );
}
