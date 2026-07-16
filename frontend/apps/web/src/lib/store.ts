"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationItem, RepositorySummary, TaskPriority, TaskStatus, WorkspaceTask } from "./types";
import { tasks as mockTasks, repositories as mockRepos, notifications as mockNotifications } from "./mock-data";

export type Account = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "developer" | "auditor" | "viewer";
  avatarInitials: string;
};

const defaultAccounts: Account[] = [
  { id: "acc-1", name: "You (Owner)", email: "owner@lattix.io", role: "owner", avatarInitials: "OW" },
];

type WorkspaceState = {
  // ── Selection ──────────────────────────────────────────
  selectedRepositoryId: string;
  selectedFilePath: string;

  // ── Live data ──────────────────────────────────────────
  tasks: WorkspaceTask[];
  repos: RepositorySummary[];
  notifications: NotificationItem[];
  accounts: Account[];
  currentAccountId: string;

  // ── Terminal ───────────────────────────────────────────
  terminalAllowed: boolean;
  terminalHistory: Array<{ type: "input" | "output" | "error"; text: string }>;

  // ── Selection actions ──────────────────────────────────
  setRepository: (id: string) => void;
  setFilePath: (path: string) => void;
  setTerminalAllowed: (allowed: boolean) => void;

  // ── Task actions ───────────────────────────────────────
  addTask: (t: { title: string; priority: TaskPriority; assignee: string; status?: TaskStatus }) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<WorkspaceTask>) => void;
  deleteTask: (id: string) => void;

  // ── Repo actions ───────────────────────────────────────
  addRepo: (r: { name: string; description: string; provider: RepositorySummary["provider"]; url?: string }) => void;
  deleteRepo: (id: string) => void;

  // ── Notification actions ───────────────────────────────
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (n: { title: string; body: string; severity: NotificationItem["severity"] }) => void;

  // ── Account actions ────────────────────────────────────
  addAccount: (a: { name: string; email: string; role: Account["role"] }) => void;
  switchAccount: (id: string) => void;

  // ── Terminal actions ───────────────────────────────────
  pushTerminalLine: (line: { type: "input" | "output" | "error"; text: string }) => void;
  clearTerminalHistory: () => void;

  // ── Computed ───────────────────────────────────────────
  currentAccount: () => Account;
  unreadCount: () => number;
};

let _taskCounter = 100;
let _repoCounter = 100;
let _notifCounter = 100;
let _accCounter = 100;

const uid = (prefix: string, counter: () => number) => `${prefix}-${Date.now()}-${counter()}`;

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      // ── Defaults ───────────────────────────────────────
      selectedRepositoryId: mockRepos[0]?.id ?? "repo-platform",
      selectedFilePath: "frontend/apps/web/src/app/page.tsx",
      tasks: mockTasks,
      repos: mockRepos,
      notifications: mockNotifications,
      accounts: defaultAccounts,
      currentAccountId: defaultAccounts[0].id,
      terminalAllowed: true,
      terminalHistory: [
        { type: "output", text: "Lattix Terminal — type a command and press Enter" },
        { type: "output", text: "Commands run in the project root directory." },
      ],

      // ── Selection ──────────────────────────────────────
      setRepository: (id) => set({ selectedRepositoryId: id }),
      setFilePath: (selectedFilePath) => set({ selectedFilePath }),
      setTerminalAllowed: (terminalAllowed) => set({ terminalAllowed }),

      // ── Tasks ──────────────────────────────────────────
      addTask: ({ title, priority, assignee, status = "todo" }) => {
        const now = new Date().toISOString();
        const task: WorkspaceTask = {
          id: `task-${++_taskCounter}`,
          title,
          priority,
          assignee: assignee || "Unassigned",
          status,
          links: [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ tasks: [...s.tasks, task] }));
        get().addNotification({ title: "Task created", body: `"${title}" added to board.`, severity: "info" });
      },

      updateTaskStatus: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
          ),
        })),

      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      // ── Repos ──────────────────────────────────────────
      addRepo: ({ name, description, provider, url }) => {
        const repo: RepositorySummary = {
          id: `repo-${++_repoCounter}`,
          name,
          description,
          provider,
          defaultBranch: "main",
          lastIndexedAt: new Date().toISOString(),
          status: "connected",
        };
        set((s) => ({ repos: [...s.repos, repo] }));
        get().addNotification({ title: "Repository added", body: `${name} connected to workspace.`, severity: "info" });
      },

      deleteRepo: (id) =>
        set((s) => ({
          repos: s.repos.filter((r) => r.id !== id),
          selectedRepositoryId: s.selectedRepositoryId === id ? (s.repos[0]?.id ?? "") : s.selectedRepositoryId,
        })),

      // ── Notifications ──────────────────────────────────
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      dismissNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      clearAllNotifications: () => set({ notifications: [] }),

      addNotification: ({ title, body, severity }) => {
        const notif: NotificationItem = {
          id: `notif-${++_notifCounter}`,
          title,
          body,
          severity,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((s) => ({ notifications: [notif, ...s.notifications] }));
      },

      // ── Accounts ───────────────────────────────────────
      addAccount: ({ name, email, role }) => {
        const initials = name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        const account: Account = {
          id: `acc-${++_accCounter}`,
          name,
          email,
          role,
          avatarInitials: initials,
        };
        set((s) => ({ accounts: [...s.accounts, account] }));
      },

      switchAccount: (id) => set({ currentAccountId: id }),

      // ── Terminal ───────────────────────────────────────
      pushTerminalLine: (line) =>
        set((s) => ({ terminalHistory: [...s.terminalHistory, line] })),

      clearTerminalHistory: () =>
        set({
          terminalHistory: [
            { type: "output", text: "Terminal cleared." },
          ],
        }),

      // ── Computed ───────────────────────────────────────
      currentAccount: () => {
        const s = get();
        return s.accounts.find((a) => a.id === s.currentAccountId) ?? s.accounts[0];
      },

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: "lattix-workspace",
      partialize: (s) => ({
        tasks: s.tasks,
        repos: s.repos,
        notifications: s.notifications,
        accounts: s.accounts,
        currentAccountId: s.currentAccountId,
        selectedRepositoryId: s.selectedRepositoryId,
        selectedFilePath: s.selectedFilePath,
        terminalHistory: s.terminalHistory,
      }),
    }
  )
);
