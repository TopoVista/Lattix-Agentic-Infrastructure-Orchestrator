# Phase 10 - Developer Workspace

## Goal

Build the first user-facing Lattix web workspace for projects, repositories, files, terminal access, documentation, notifications, and task tracking.

## Why This Phase Exists

The developer workspace turns platform foundations into a usable product. It gives users a place to connect repositories, browse code, inspect project status, read docs, receive notifications, and later interact with intelligent editor and agent features.

## Success Criteria

- Authenticated users can view a workspace dashboard.
- Users can browse projects and repositories.
- File explorer and read-only file viewer are available.
- Terminal surface is designed with security boundaries, even if command execution is initially restricted.
- Git panel, documentation panel, notifications, and task board have working data contracts.

## Deliverables

- Next.js frontend application shell.
- Workspace dashboard.
- Repository browser.
- File explorer and file viewer.
- Terminal UI placeholder with permission model.
- Git panel.
- Docs panel.
- Notifications center.
- Task board.

## Folder Structure

```text
frontend/
  apps/web/
    app/
    components/
      workspace/
      repositories/
      files/
      terminal/
      git/
      docs/
      notifications/
      tasks/
    lib/
      api/
      auth/
      state/
      telemetry/
```

## Modules To Build

- App shell module for navigation, layout, auth state, and workspace switching.
- Dashboard module for project and repository summaries.
- Repository browser module.
- File explorer module.
- Terminal module with policy-aware session requests.
- Git panel module for branch, status, commits, and PR links.
- Documentation module for project docs.
- Notification module.
- Task board module.

## Functionality

- Display workspace overview with active projects, repositories, agents, tasks, and incidents.
- Let users connect or select repositories.
- Browse repository tree and view file contents.
- Show Git metadata and future action controls.
- Display documentation linked to project and repository.
- Display notification feed from backend.
- Manage tasks with status, assignee, priority, and links to repositories or agents.

## Tech Stack

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- TanStack Query or SWR.
- Zustand or equivalent lightweight state.
- Monaco later in phase 11.
- OpenTelemetry web instrumentation.

## Implementation Plan

1. Create Next.js app shell with authenticated layout and workspace navigation.
2. Implement API client with gateway base URL, auth token injection, typed errors, and trace headers.
3. Build dashboard data cards and activity feed.
4. Build repository list and repository detail route.
5. Build file explorer tree and read-only file viewer.
6. Build terminal UI surface with disabled command execution unless backend session policy allows it.
7. Build Git panel contract for status, branches, commits, and remote links.
8. Build docs panel and task board.
9. Add loading, empty, error, and permission-denied states.
10. Add basic accessibility and responsive checks.

## Functions / Classes / Interfaces To Implement

```ts
fetchWorkspaceDashboard(workspaceId: string): Promise<WorkspaceDashboard>
// Loads projects, repositories, activity, tasks, notifications, and health summary.

listRepositoryTree(input: RepositoryTreeRequest): Promise<FileTreeNode[]>
// Returns a repository tree for a branch and path with permission checks handled by API.

readRepositoryFile(input: ReadFileRequest): Promise<FileContent>
// Loads file content, language hint, size, encoding, and last commit metadata.

requestTerminalSession(input: TerminalSessionRequest): Promise<TerminalSessionPolicy>
// Requests a terminal session and returns allowed mode, reason, audit id, and expiry.

updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task>
// Moves a workspace task across task board states and records actor metadata.
```

## Configuration / Environment Variables

- `NEXT_PUBLIC_LATTIX_API_BASE_URL`
- `NEXT_PUBLIC_OTEL_ENDPOINT`
- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_AUTH_CLIENT_ID`

## Data Models / Schemas / Contracts

- `WorkspaceDashboard`: workspace, projects, repositories, tasks, notifications, activity, health.
- `RepositorySummary`: id, name, provider, defaultBranch, lastIndexedAt, status.
- `FileTreeNode`: path, name, type, size, childrenLoaded.
- `FileContent`: path, content, language, encoding, sizeBytes, lastCommit.
- `Task`: id, title, status, priority, assignee, links, createdAt, updatedAt.

## Testing Plan

- Component tests for dashboard, file tree, notifications, and task board.
- API client tests for auth headers and error mapping.
- End-to-end smoke test for login, dashboard, repository selection, and file read.
- Accessibility checks for keyboard navigation and labels.
- Responsive checks for desktop and tablet layouts.

## Acceptance Criteria

- Authenticated users can navigate the main workspace without backend implementation gaps hidden by fake UI.
- Repository and file views have realistic data contracts.
- Terminal UI is permission-aware and safe by default.
- Loading, empty, error, and unauthorized states are polished.

## Risks And Mitigations

- Risk: frontend gets ahead of backend contracts. Mitigation: define typed API contracts and mock only through contract fixtures.
- Risk: terminal is unsafe. Mitigation: start with request-only policy and audit-first design.
- Risk: workspace becomes cluttered. Mitigation: keep dashboard dense, scan-friendly, and role-oriented.

## Next Phase Handoff

Phase 11 should replace the simple file viewer with an intelligent Monaco-based code editor and code navigation surfaces.
