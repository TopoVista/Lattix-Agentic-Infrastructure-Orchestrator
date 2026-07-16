import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { ReliabilityPanel } from "@/components/platform/reliability-panel";

export const metadata = { title: "Enterprise — Lattix Platform" };

export default function EnterprisePage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text">Enterprise — Phases 37–40</h1>
          <p className="text-sm text-muted mt-1">Performance benchmarking, cost optimization engine with rightsizing recommendations, documentation portal with SDKs and CLI, and enterprise production readiness gates for launch.</p>
        </div>
        <ReliabilityPanel />
      </PlatformShell>
    </WorkspaceShell>
  );
}
