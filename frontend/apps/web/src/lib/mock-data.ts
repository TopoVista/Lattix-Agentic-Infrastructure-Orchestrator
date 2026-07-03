import type {
  DocsLink,
  FileContent,
  FileTreeNode,
  GitBranch,
  GitCommit,
  NotificationItem,
  RepositorySummary,
  TerminalSessionPolicy,
  WorkspaceDashboard,
  WorkspaceSummary,
  WorkspaceTask
} from "./types";

export const workspaceSummary: WorkspaceSummary = {
  id: "ws-lattix",
  name: "Lattix Platform",
  role: "owner",
  health: "ok",
  activeProjects: 12,
  activeRepositories: 8,
  openTasks: 19,
  notifications: 4
};

export const repositories: RepositorySummary[] = [
  {
    id: "repo-platform",
    name: "lattix-platform",
    provider: "github",
    defaultBranch: "main",
    lastIndexedAt: "2026-07-03T10:25:00Z",
    status: "connected",
    description: "Core monorepo for the platform and workspace surfaces."
  },
  {
    id: "repo-agents",
    name: "lattix-agents",
    provider: "github",
    defaultBranch: "main",
    lastIndexedAt: "2026-07-03T10:05:00Z",
    status: "indexing",
    description: "Agent orchestration and specialization packages."
  }
];

export const fileTree: FileTreeNode[] = [
  {
    path: "frontend/apps/web/src/app",
    name: "app",
    type: "directory",
    childrenLoaded: true,
    children: [
      { path: "frontend/apps/web/src/app/page.tsx", name: "page.tsx", type: "file", size: 2892, childrenLoaded: false },
      { path: "frontend/apps/web/src/app/layout.tsx", name: "layout.tsx", type: "file", size: 1119, childrenLoaded: false }
    ]
  },
  {
    path: "frontend/apps/web/src/components",
    name: "components",
    type: "directory",
    childrenLoaded: true,
    children: [
      { path: "frontend/apps/web/src/components/workspace-shell.tsx", name: "workspace-shell.tsx", type: "file", size: 4012, childrenLoaded: false }
    ]
  }
];

export const fileContent: FileContent = {
  path: "frontend/apps/web/src/app/page.tsx",
  content: `export default function WorkspacePage() {\n  return <main>Lattix workspace</main>;\n}`,
  language: "tsx",
  encoding: "utf-8",
  sizeBytes: 84,
  lastCommit: {
    sha: "a1b2c3d",
    message: "feat: scaffold workspace shell",
    author: "Codex",
    committedAt: "2026-07-03T10:00:00Z"
  }
};

export const branches: GitBranch[] = [
  { name: "main", isCurrent: true, ahead: 0, behind: 0 },
  { name: "workspace-ui", isCurrent: false, ahead: 4, behind: 1 }
];

export const recentCommits: GitCommit[] = [
  {
    sha: "f4e1a29",
    message: "feat(workspace): add dashboard cards",
    author: "Codex",
    committedAt: "2026-07-03T09:40:00Z"
  },
  {
    sha: "b7c9d21",
    message: "feat(files): wire file tree preview",
    author: "Codex",
    committedAt: "2026-07-03T09:15:00Z"
  }
];

export const docs: DocsLink[] = [
  { title: "Workspace Overview", href: "/docs/workspace", kind: "readme" },
  { title: "Repository Contract", href: "/docs/repositories", kind: "spec" },
  { title: "Developer Workflow ADR", href: "/docs/adr/developer-workspace", kind: "adr" }
];

export const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Repository indexing finished",
    body: "lattix-platform is ready for file browsing and search.",
    severity: "info",
    createdAt: "2026-07-03T10:20:00Z",
    read: false
  },
  {
    id: "notif-2",
    title: "Agent queue elevated",
    body: "Two agent tasks are waiting on approval.",
    severity: "warning",
    createdAt: "2026-07-03T10:10:00Z",
    read: false
  }
];

export const tasks: WorkspaceTask[] = [
  {
    id: "task-1",
    title: "Review auth middleware contract",
    status: "in_progress",
    priority: "high",
    assignee: "TopoVista",
    links: ["repo-platform", "docs/adr/auth"],
    createdAt: "2026-07-03T08:20:00Z",
    updatedAt: "2026-07-03T10:00:00Z"
  },
  {
    id: "task-2",
    title: "Validate repository tree sync",
    status: "todo",
    priority: "medium",
    assignee: "Unassigned",
    links: ["repo-agents"],
    createdAt: "2026-07-03T09:05:00Z",
    updatedAt: "2026-07-03T09:05:00Z"
  }
];

export const terminalPolicy: TerminalSessionPolicy = {
  allowed: false,
  mode: "request-only",
  reason: "Terminal execution is disabled until a policy-approved session is issued by the backend.",
  auditId: "audit-term-001",
  expiresAt: "2026-07-03T11:00:00Z"
};

export const dashboard: WorkspaceDashboard = {
  workspace: workspaceSummary,
  repositories,
  selectedRepository: repositories[0],
  fileTree,
  fileContent,
  branches,
  recentCommits,
  docs,
  notifications,
  tasks,
  terminalPolicy,
  activity: [
    {
      id: "act-1",
      title: "Indexed repository",
      detail: "lattix-platform scan completed with 98% source coverage.",
      time: "5 min ago"
    },
    {
      id: "act-2",
      title: "Task updated",
      detail: "Workspace review task moved to in progress.",
      time: "14 min ago"
    }
  ]
};
