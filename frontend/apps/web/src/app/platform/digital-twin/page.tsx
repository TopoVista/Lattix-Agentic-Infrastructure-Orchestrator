import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { DigitalTwinPanel } from "@/components/platform/digital-twin-panel";

export const metadata = { title: "Digital Twin — Lattix Platform" };

export default function DigitalTwinPage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text">Digital Twin — Phases 27, 38</h1>
          <p className="text-sm text-muted mt-1">Living model of your entire system: code, infrastructure, data flows, cost model, incidents, decisions, and deployments. Powered by the knowledge graph and observability pipeline.</p>
        </div>
        <DigitalTwinPanel />
      </PlatformShell>
    </WorkspaceShell>
  );
}
