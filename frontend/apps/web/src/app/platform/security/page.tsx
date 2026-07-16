import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { SecurityPanel } from "@/components/platform/security-panel";

export const metadata = { title: "Security — Lattix Platform" };

export default function SecurityPage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text">Security & Compliance — Phases 07, 35–36</h1>
          <p className="text-sm text-muted mt-1">Zero trust architecture, secrets management, supply chain security, runtime protection, RBAC/ABAC enforcement, SOC 2 Type II, GDPR, ISO 27001 compliance controls, and full audit trail.</p>
        </div>
        <SecurityPanel />
      </PlatformShell>
    </WorkspaceShell>
  );
}
