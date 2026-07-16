"use client";

import { useEffect, useState } from "react";
import { Brain, Bot, Code2, Search, BookOpen, Cpu, MessageSquare, Wrench, Users, ChevronDown, ChevronRight, Zap, CheckCircle2, Clock } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

type SystemsData = {
  knowledgeGraph: { modules: string[]; importers: string[]; nodeTypes: string[]; edgeTypes: string[]; status: string; description: string };
  memory: { modules: string[]; types: string[]; status: string; description: string };
  mcp: { tools: string[]; registeredTools: { name: string; type: string; status: string }[]; description: string; status: string };
  digitalTwin: { modules: string[]; views: string[]; status: string; description: string };
  observability: { modules: string[]; alerts: string[]; dashboards: string[]; metrics: string[]; status: string; description: string };
};

type AgentsData = {
  agents: { roles: { id: string; name: string; type: string; status: string; description: string; capabilities: string[] }[]; platform: { modules: string[]; status: string; totalAgents: number } };
  aiPlatform: { modules: string[]; codeCompletion: { modules: string[]; status: string; description: string }; repositoryIntelligence: { modules: string[]; status: string; description: string }; chatPipeline: { modules: string[]; status: string; description: string } };
};

const STATUS_BADGE = ({ s }: { s: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
    s === "running" || s === "active" || s === "ready" || s === "indexed" ? "bg-accent2/20 text-accent2"
    : s === "syncing" || s === "collecting" ? "bg-warning/20 text-warning"
    : "bg-muted/20 text-muted"
  }`}>
    {(s === "running" || s === "active" || s === "ready" || s === "indexed") && <span className="size-1.5 rounded-full bg-accent2 inline-block animate-pulse" />}
    {s}
  </span>
);

function Section({ title, icon: Icon, color, children }: { title: string; icon: React.ElementType; color: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <Card>
      <CardHeader>
        <button onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Icon className={`size-4 ${color}`} />
            {title}
          </div>
          {open ? <ChevronDown className="size-4 text-muted" /> : <ChevronRight className="size-4 text-muted" />}
        </button>
      </CardHeader>
      {open && <CardBody>{children}</CardBody>}
    </Card>
  );
}

function ModuleChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-[#10192e] px-2 py-1 font-mono text-[11px] text-accent2">
      {name.replace(".py", "").replace(/_/g, " ")}
    </span>
  );
}

export function AICorePanel() {
  const [systems, setSystems] = useState<SystemsData | null>(null);
  const [agents, setAgents] = useState<AgentsData | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hello! I'm the Lattix AI assistant. I can help you analyze code, query the knowledge graph, manage agents, and orchestrate infrastructure. What would you like to do?" }
  ]);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/platform/systems").then(r => r.json()),
      fetch("/api/platform/agents").then(r => r.json()),
    ]).then(([s, a]) => { setSystems(s); setAgents(a); });
  }, []);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory(h => [...h, { role: "user", text: userMsg }]);

    // Simulate intelligent responses based on input
    setTimeout(() => {
      let response = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("knowledge graph") || lower.includes("graph")) {
        response = `The Knowledge Graph has ${systems?.knowledgeGraph.nodeTypes.length ?? 9} node types: ${systems?.knowledgeGraph.nodeTypes.join(", ")}. It connects ${systems?.knowledgeGraph.edgeTypes.length ?? 6} relationship types including ${systems?.knowledgeGraph.edgeTypes.slice(0,3).join(", ")}. Status: ${systems?.knowledgeGraph.status ?? "ready"}.`;
      } else if (lower.includes("agent") || lower.includes("engineer")) {
        response = `The Multi-Agent Platform has ${agents?.agents.platform.totalAgents ?? 0} specialized agent roles: ${agents?.agents.roles.map(r => r.name).join(", ")}. Each agent can perform code analysis, PR review, automated fixes, and documentation tasks.`;
      } else if (lower.includes("memory")) {
        response = `The Memory System has 5 tiers: ${systems?.memory.types.join(", ")}. Working memory holds current context, semantic memory stores embeddings, long-term memory persists facts. Status: ${systems?.memory.status ?? "active"}.`;
      } else if (lower.includes("mcp") || lower.includes("tool")) {
        response = `The MCP Tool Ecosystem has ${systems?.mcp.registeredTools.length ?? 8} registered tools: ${systems?.mcp.registeredTools.map(t => t.name).join(", ")}. All tools are accessible via the Model Context Protocol standard.`;
      } else if (lower.includes("code") || lower.includes("completion")) {
        response = `Code Completion Engine (Phase 13) has ${agents?.aiPlatform.codeCompletion.modules.length ?? 0} modules. ${agents?.aiPlatform.codeCompletion.description}. It generates code, tests, APIs, events, and configs from repository context.`;
      } else if (lower.includes("repo") || lower.includes("intelligence")) {
        response = `Repository Intelligence (Phase 12) has ${agents?.aiPlatform.repositoryIntelligence.modules.length ?? 0} modules. ${agents?.aiPlatform.repositoryIntelligence.description}. It indexes your codebase into a structural graph.`;
      } else {
        response = `I processed your query: "${userMsg}". The Lattix platform has 40 phases covering AI agents, knowledge graphs, digital twins, observability, multi-region deployment, and enterprise production readiness. Ask me about any specific feature!`;
      }
      setChatHistory(h => [...h, { role: "assistant", text: response }]);
    }, 600);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      {/* Left: Feature panels */}
      <div className="space-y-4">
        {/* Phase badges */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-[#080f1e] p-3">
          {["P10 Developer Workspace", "P11 Code Editor", "P12 Repo Intelligence", "P13 Code Completion", "P14 Knowledge Graph", "P15 Memory", "P16 Multi-Agent", "P17 MCP Tools", "P18 Chatbot", "P19 AI Engineers"].map(p => (
            <span key={p} className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-mono text-accent">{p}</span>
          ))}
        </div>

        {/* Knowledge Graph */}
        <Section title="Knowledge Graph (Phase 14)" icon={Brain} color="text-[#34d399]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <STATUS_BADGE s={systems?.knowledgeGraph.status ?? "loading"} />
              <span className="text-xs text-muted">{systems?.knowledgeGraph.description}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-line bg-[#080f1e] p-3">
                <div className="mb-2 text-[10px] uppercase tracking-widest text-muted">Node Types</div>
                <div className="flex flex-wrap gap-1">
                  {(systems?.knowledgeGraph.nodeTypes ?? []).map(n => (
                    <span key={n} className="rounded border border-[#34d399]/30 bg-[#34d399]/10 px-1.5 py-0.5 text-[10px] text-[#34d399]">{n}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-[#080f1e] p-3">
                <div className="mb-2 text-[10px] uppercase tracking-widest text-muted">Edge Types (Relationships)</div>
                <div className="flex flex-wrap gap-1">
                  {(systems?.knowledgeGraph.edgeTypes ?? []).map(e => (
                    <span key={e} className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">{e}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-line bg-[#080f1e] p-3">
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted">Python Modules</div>
              <div className="flex flex-wrap gap-1.5">
                {(systems?.knowledgeGraph.modules ?? []).map(m => <ModuleChip key={m} name={m} />)}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-[#080f1e] p-3">
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted">Importers</div>
              <div className="flex flex-wrap gap-1.5">
                {(systems?.knowledgeGraph.importers ?? []).map(i => (
                  <span key={i} className="rounded-md border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2 py-0.5 text-[10px] text-[#f59e0b]">{i}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Memory System */}
        <Section title="Memory System (Phase 15)" icon={BookOpen} color="text-[#a78bfa]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <STATUS_BADGE s={systems?.memory.status ?? "loading"} />
              <span className="text-xs text-muted">{systems?.memory.description}</span>
            </div>
            <div className="grid gap-2 md:grid-cols-5">
              {(systems?.memory.types ?? ["working","semantic","long-term","procedural","organizational"]).map((t, i) => (
                <div key={t} className="rounded-lg border border-line bg-[#080f1e] p-3 text-center">
                  <div className="text-lg font-bold text-[#a78bfa]">{["W","S","L","P","O"][i]}</div>
                  <div className="mt-1 text-[10px] capitalize text-muted">{t}</div>
                  <div className="mt-1.5 size-1.5 rounded-full bg-accent2 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-line bg-[#080f1e] p-3">
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted">Active Modules</div>
              <div className="flex flex-wrap gap-1.5">
                {(systems?.memory.modules ?? []).map(m => <ModuleChip key={m} name={m} />)}
              </div>
            </div>
          </div>
        </Section>

        {/* Multi-Agent Platform */}
        <Section title="Multi-Agent Platform & AI Engineers (Phases 16, 19)" icon={Users} color="text-[#f59e0b]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <STATUS_BADGE s={agents?.agents.platform.status ?? "loading"} />
              <span className="text-xs text-muted">{agents?.agents.platform.totalAgents ?? 0} specialized agent roles deployed</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {(agents?.agents.roles ?? []).map(role => (
                <div key={role.id} className="rounded-lg border border-line bg-[#080f1e] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-text">{role.name}</div>
                      <div className="text-[11px] text-muted mt-0.5">{role.description}</div>
                    </div>
                    <STATUS_BADGE s={role.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {role.capabilities.map(c => (
                      <span key={c} className="rounded border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-1.5 py-0.5 text-[10px] text-[#f59e0b]">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {agents && (
              <div className="rounded-lg border border-line bg-[#080f1e] p-3">
                <div className="mb-2 text-[10px] uppercase tracking-widest text-muted">Platform Modules</div>
                <div className="flex flex-wrap gap-1.5">
                  {agents.agents.platform.modules.map(m => <ModuleChip key={m} name={m} />)}
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* MCP Tool Ecosystem */}
        <Section title="MCP Tool Ecosystem (Phase 17)" icon={Wrench} color="text-[#60a5fa]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <STATUS_BADGE s={systems?.mcp.status ?? "loading"} />
              <span className="text-xs text-muted">{systems?.mcp.description}</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {(systems?.mcp.registeredTools ?? []).map(tool => (
                <div key={tool.name} className="flex items-center justify-between rounded-lg border border-line bg-[#080f1e] px-3 py-2">
                  <div>
                    <div className="text-sm font-mono text-text">{tool.name}</div>
                    <div className="text-[10px] uppercase text-muted">{tool.type}</div>
                  </div>
                  <STATUS_BADGE s={tool.status} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Code Intelligence */}
        <Section title="Code Intelligence (Phases 12-13)" icon={Code2} color="text-[#f472b6]">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { label: "Repository Intelligence", data: agents?.aiPlatform.repositoryIntelligence, color: "text-[#f472b6]" },
              { label: "Code Completion Engine", data: agents?.aiPlatform.codeCompletion, color: "text-accent2" },
            ].map(({ label, data, color }) => (
              <div key={label} className="rounded-lg border border-line bg-[#080f1e] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                  <STATUS_BADGE s={data?.status ?? "loading"} />
                </div>
                <p className="text-[11px] text-muted mb-2">{data?.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(data?.modules ?? []).map(m => <ModuleChip key={m} name={m} />)}
                </div>
              </div>
            ))}
          </div>
          {/* Chatbot Pipeline */}
          <div className="mt-3 rounded-lg border border-line bg-[#080f1e] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#7dd3fc]">Intelligent Chatbot Pipeline (Phase 18)</span>
              <STATUS_BADGE s={agents?.aiPlatform.chatPipeline.status ?? "loading"} />
            </div>
            <p className="text-[11px] text-muted mb-2">{agents?.aiPlatform.chatPipeline.description}</p>
            <div className="flex flex-wrap gap-1">
              {(agents?.aiPlatform.chatPipeline.modules ?? []).map(m => <ModuleChip key={m} name={m} />)}
            </div>
          </div>
        </Section>
      </div>

      {/* Right: AI Chat Interface */}
      <div className="xl:sticky xl:top-4 xl:h-[calc(100vh-140px)] flex flex-col">
        <Card className="flex flex-col flex-1 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="size-4 text-accent" />
              AI Assistant
              <STATUS_BADGE s="ready" />
            </div>
          </CardHeader>
          <CardBody className="flex flex-col flex-1 overflow-hidden p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-[#060d1a] font-medium"
                      : "bg-[#10192e] border border-line text-text"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Quick prompts */}
            <div className="border-t border-line px-3 py-2 flex flex-wrap gap-1.5">
              {["Tell me about the Knowledge Graph", "What agents are available?", "Memory system status", "MCP tools list"].map(q => (
                <button key={q} onClick={() => { setChatInput(q); }}
                  className="rounded-md border border-line bg-[#080f1e] px-2 py-1 text-[10px] text-muted hover:text-text hover:border-accent/40 transition">
                  {q}
                </button>
              ))}
            </div>
            {/* Input */}
            <div className="border-t border-line p-3 flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Ask about any Lattix feature…"
                className="flex-1 rounded-lg border border-line bg-[#080f1e] px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-accent/50"
              />
              <button onClick={sendChat} className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-[#060d1a] hover:bg-accent/90">
                Send
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
