import path from "path";
import fs from "fs";

const ROOT = path.resolve(process.cwd(), "../../..");

function readPyModules(dir: string): string[] {
  try {
    return fs.readdirSync(path.resolve(ROOT, dir)).filter(f => f.endsWith(".py") && !f.startsWith("__"));
  } catch { return []; }
}

function listSubdirs(dir: string): string[] {
  try {
    return fs.readdirSync(path.resolve(ROOT, dir), { withFileTypes: true })
      .filter(e => e.isDirectory()).map(e => e.name);
  } catch { return []; }
}

export async function GET() {
  // Real agent roles from the filesystem
  const roles = listSubdirs("agents/roles");
  const agentModules = readPyModules("agents/lattix_agents");

  // Real AI platform modules
  const aiPlatformDirs = listSubdirs("ai-platform");

  // Code completion modules
  const codeCompletionModules = readPyModules("ai-platform/code-completion/lattix_code_completion");

  // Repository intelligence modules
  const repoIntelModules = readPyModules("ai-platform/repository-intelligence/lattix_ai_repository_intelligence");

  // Chat pipeline modules
  const chatModules = readPyModules("ai-platform/chat-pipeline/lattix_chat_pipeline");

  return Response.json({
    agents: {
      roles: roles.map(r => ({
        id: r,
        name: r.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        type: r.includes("eng") || r.includes("soft") ? "software-engineer" 
          : r.includes("ops") ? "ops-engineer"
          : r.includes("sec") ? "security-engineer"
          : r.includes("ml") ? "ml-engineer"
          : "specialist",
        status: "available",
        description: `AI ${r.replace(/-/g, " ")} agent for automated engineering tasks`,
        capabilities: ["code-analysis", "pr-review", "automated-fixes", "documentation"],
      })),
      platform: {
        modules: agentModules,
        status: "running",
        totalAgents: roles.length,
      },
    },
    aiPlatform: {
      modules: aiPlatformDirs,
      codeCompletion: {
        modules: codeCompletionModules,
        status: "ready",
        description: "Repository-aware code, test, API and config generation",
      },
      repositoryIntelligence: {
        modules: repoIntelModules,
        status: "indexed",
        description: "Structural analysis and code graph indexing",
      },
      chatPipeline: {
        modules: chatModules,
        status: "ready",
        description: "Intent, planning, retrieval, reasoning, verification pipeline",
      },
    },
  });
}
