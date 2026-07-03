import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { WorkspaceDashboardView } from "@/components/workspace/dashboard";
import { dashboard } from "@/lib/mock-data";

export default function Page() {
  return (
    <WorkspaceShell workspace={dashboard.workspace}>
      <WorkspaceDashboardView dashboard={dashboard} />
    </WorkspaceShell>
  );
}
