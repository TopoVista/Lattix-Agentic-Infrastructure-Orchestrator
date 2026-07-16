import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { PhaseOverview } from "@/components/platform/phase-overview";

export const metadata = { title: "Platform Portal — Lattix", description: "All 40 phases of the Lattix platform" };

export default function PlatformPage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <PhaseOverview />
      </PlatformShell>
    </WorkspaceShell>
  );
}
