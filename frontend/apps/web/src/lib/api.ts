import { dashboard, repositories } from "./mock-data";
import type { FileTreeNode, FileContent, TerminalSessionPolicy, WorkspaceDashboard, WorkspaceTask, TaskStatus } from "./types";

export type ApiClientOptions = {
  baseUrl?: string;
  token?: string;
  fetchImpl?: typeof fetch;
};

export class LattixApiClient {
  private readonly baseUrl: string;
  private readonly token?: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? process.env.NEXT_PUBLIC_LATTIX_API_BASE_URL ?? "";
    this.token = options.token;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async fetchWorkspaceDashboard(workspaceId: string): Promise<WorkspaceDashboard> {
    if (!this.baseUrl) {
      return dashboard;
    }
    return this.getJson<WorkspaceDashboard>(`/workspaces/${workspaceId}/dashboard`);
  }

  async listRepositories(): Promise<typeof repositories> {
    if (!this.baseUrl) {
      return repositories;
    }
    return this.getJson("/repositories");
  }

  async listRepositoryTree(repositoryId: string, branch: string, path = ""): Promise<FileTreeNode[]> {
    if (!this.baseUrl) {
      return dashboard.fileTree;
    }
    return this.getJson(`/repositories/${repositoryId}/tree?branch=${encodeURIComponent(branch)}&path=${encodeURIComponent(path)}`);
  }

  async readRepositoryFile(repositoryId: string, path: string, branch: string): Promise<FileContent> {
    if (!this.baseUrl) {
      return dashboard.fileContent;
    }
    return this.getJson(`/repositories/${repositoryId}/files?path=${encodeURIComponent(path)}&branch=${encodeURIComponent(branch)}`);
  }

  async requestTerminalSession(workspaceId: string): Promise<TerminalSessionPolicy> {
    if (!this.baseUrl) {
      return dashboard.terminalPolicy;
    }
    return this.getJson(`/workspaces/${workspaceId}/terminal-session`);
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<WorkspaceTask> {
    if (!this.baseUrl) {
      const task = dashboard.tasks.find((item) => item.id === taskId);
      if (!task) {
        throw new Error(`Unknown task: ${taskId}`);
      }
      return { ...task, status, updatedAt: new Date().toISOString() };
    }
    return this.postJson(`/tasks/${taskId}/status`, { status });
  }

  private async getJson<T>(path: string): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      headers: this.buildHeaders()
    });
    return this.readResponse<T>(response);
  }

  private async postJson<T>(path: string, body: unknown): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return this.readResponse<T>(response);
  }

  private buildHeaders() {
    const headers: Record<string, string> = {
      "x-lattix-app": "web"
    };
    if (this.token) {
      headers.authorization = `Bearer ${this.token}`;
    }
    const traceId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : undefined;
    if (traceId) {
      headers["x-trace-id"] = traceId;
    }
    return headers;
  }

  private async readResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed with ${response.status}`);
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error("Expected JSON response");
    }
    return (await response.json()) as T;
  }
}
