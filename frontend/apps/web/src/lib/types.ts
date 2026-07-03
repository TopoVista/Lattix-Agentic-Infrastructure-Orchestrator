export type WorkspaceSummary = {
  id: string;
  name: string;
  role: "owner" | "admin" | "developer" | "auditor" | "viewer";
  health: "ok" | "warning" | "critical";
  activeProjects: number;
  activeRepositories: number;
  openTasks: number;
  notifications: number;
};

export type RepositorySummary = {
  id: string;
  name: string;
  provider: "github" | "gitlab" | "bitbucket" | "local";
  defaultBranch: string;
  lastIndexedAt: string;
  status: "connected" | "indexing" | "error";
  description: string;
};

export type FileTreeNode = {
  path: string;
  name: string;
  type: "file" | "directory";
  size?: number;
  childrenLoaded: boolean;
  children?: FileTreeNode[];
};

export type FileContent = {
  path: string;
  content: string;
  language: string;
  encoding: string;
  sizeBytes: number;
  lastCommit: {
    sha: string;
    message: string;
    author: string;
    committedAt: string;
  };
};

export type GitBranch = {
  name: string;
  isCurrent: boolean;
  ahead: number;
  behind: number;
};

export type GitCommit = {
  sha: string;
  message: string;
  author: string;
  committedAt: string;
};

export type DocsLink = {
  title: string;
  href: string;
  kind: "spec" | "runbook" | "adr" | "readme";
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
  read: boolean;
};

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type WorkspaceTask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  links: string[];
  createdAt: string;
  updatedAt: string;
};

export type TerminalSessionPolicy = {
  allowed: boolean;
  mode: "request-only" | "interactive" | "blocked";
  reason: string;
  auditId: string;
  expiresAt: string;
};

export type WorkspaceView = "files" | "editor" | "git" | "terminal" | "docs" | "notifications" | "tasks";

export type WorkspaceDashboard = {
  workspace: WorkspaceSummary;
  repositories: RepositorySummary[];
  selectedRepository: RepositorySummary;
  fileTree: FileTreeNode[];
  fileContent: FileContent;
  branches: GitBranch[];
  recentCommits: GitCommit[];
  docs: DocsLink[];
  notifications: NotificationItem[];
  tasks: WorkspaceTask[];
  terminalPolicy: TerminalSessionPolicy;
  activity: Array<{
    id: string;
    title: string;
    detail: string;
    time: string;
  }>;
};
