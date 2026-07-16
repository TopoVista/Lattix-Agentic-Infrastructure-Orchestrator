import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { WorkspaceDashboardView } from "@/components/workspace/dashboard";

export default function Page() {
  return (
    <WorkspaceShell>
      <WorkspaceDashboardView />
    </WorkspaceShell>
  );
}
