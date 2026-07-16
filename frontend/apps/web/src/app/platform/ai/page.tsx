import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { PlatformShell } from "@/components/platform/platform-shell";
import { AICorePanel } from "@/components/platform/ai-core-panel";

export const metadata = { title: "AI Core — Lattix Platform", description: "Phases 10-19: Code Editor, Repo Intelligence, Knowledge Graph, Memory, Multi-Agent, MCP, Chatbot, AI Engineers" };

export default function AIPlatformPage() {
  return (
    <WorkspaceShell>
      <PlatformShell>
        <div className="mb-4">
          <h1 className="text-lg font-bold text-text">AI Core — Phases 10–19</h1>
          <p className="text-sm text-muted mt-1">Intelligent code editor, repository intelligence, knowledge graph, memory system, multi-agent platform, MCP tool ecosystem, intelligent chatbot pipeline, and AI software engineers.</p>
        </div>
        <AICorePanel />
      </PlatformShell>
    </WorkspaceShell>
  );
}
