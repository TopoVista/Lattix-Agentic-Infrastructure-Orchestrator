import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { ObservabilityPanel } from "@/components/platform/observability-panel";

export const metadata = { title: "Observability — Lattix Platform" };

export default function ObservabilityPage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text">Observability — Phase 26</h1>
          <p className="text-sm text-muted mt-1">OpenTelemetry-based metrics, structured logs, distributed traces, alert rules, Grafana dashboards, Prometheus scraping, Loki log aggregation, and Jaeger tracing.</p>
        </div>
        <ObservabilityPanel />
      </PlatformShell>
    </WorkspaceShell>
  );
}
