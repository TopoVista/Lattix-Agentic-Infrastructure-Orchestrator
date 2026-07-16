import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { InfrastructurePanel } from "@/components/platform/infrastructure-panel";

export const metadata = { title: "Infrastructure — Lattix Platform" };

export default function InfrastructurePage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text">Infrastructure — Phases 03–07, 24–25, 32–33</h1>
          <p className="text-sm text-muted mt-1">Cloud infrastructure (AWS/GCP/Azure), Kubernetes platform, Spring Boot services, API gateway, authentication, cloud controllers, CI/CD pipelines, and disaster recovery.</p>
        </div>
        <InfrastructurePanel />
      </PlatformShell>
    </WorkspaceShell>
  );
}
