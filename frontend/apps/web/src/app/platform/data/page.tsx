import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { DataMLPanel } from "@/components/platform/data-ml-panel";

export const metadata = { title: "Data & ML — Lattix Platform" };

export default function DataPage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text">Data & ML — Phases 08, 20–23</h1>
          <p className="text-sm text-muted mt-1">Polyglot database layer, Kafka/Flink/Spark streaming pipelines, ML model registry with MLflow, computer vision (diagrams, OCR, UI-to-code), and signal processing (speech, audio, meeting intelligence).</p>
        </div>
        <DataMLPanel />
      </PlatformShell>
    </WorkspaceShell>
  );
}
