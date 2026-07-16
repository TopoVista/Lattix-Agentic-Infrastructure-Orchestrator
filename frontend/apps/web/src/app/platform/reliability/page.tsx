import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { ReliabilityPanel } from "@/components/platform/reliability-panel";

export const metadata = { title: "Reliability — Lattix Platform" };

export default function ReliabilityPage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text">Reliability — Phases 28–34, 37, 40</h1>
          <p className="text-sm text-muted mt-1">Redis clustering, database scaling, advanced traffic control, service mesh optimization, disaster recovery, multi-region deployment, chaos engineering, performance benchmarking, and production readiness gates.</p>
        </div>
        <ReliabilityPanel />
      </PlatformShell>
    </WorkspaceShell>
  );
}
