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

function readYamlFiles(dir: string): string[] {
  try {
    return fs.readdirSync(path.resolve(ROOT, dir)).filter(f => f.endsWith(".yaml") || f.endsWith(".yml"));
  } catch { return []; }
}

export async function GET() {
  // Knowledge Graph
  const kgModules = readPyModules("knowledge-graph/lattix_knowledge_graph");
  const kgImporters = listSubdirs("knowledge-graph/importers");

  // Memory System
  const memoryModules = readPyModules("memory/lattix_memory");

  // MCP Tools
  const toolServiceDirs = listSubdirs("services/tool-service");

  // Digital Twin
  const twinModules = listSubdirs("digital-twin").length > 0
    ? listSubdirs("digital-twin")
    : ["system-model", "cost-model", "incident-model", "infra-model"];

  // Observability
  const obsModules = readPyModules("observability/lattix_observability");
  const obsAlerts = readYamlFiles("observability/alerts");
  const obsDashboards = listSubdirs("observability/dashboards");
  const obsMetrics = readYamlFiles("observability/metrics");

  return Response.json({
    knowledgeGraph: {
      modules: kgModules,
      importers: kgImporters,
      status: "ready",
      nodeTypes: ["Code", "Developer", "Repo", "Service", "Incident", "Decision", "Requirement", "Cost", "Infra"],
      edgeTypes: ["CALLS", "DEPENDS_ON", "AUTHORED_BY", "DEPLOYED_TO", "RESOLVED_BY", "DOCUMENTS"],
      description: "Neo4j-backed graph connecting code, people, infra, incidents and decisions",
    },
    memory: {
      modules: memoryModules,
      types: ["working", "semantic", "long-term", "procedural", "organizational"],
      status: "active",
      description: "Multi-tier memory: working context, semantic embeddings, long-term facts",
    },
    mcp: {
      tools: toolServiceDirs,
      status: "running",
      description: "Model Context Protocol servers and external tool integrations",
      registeredTools: [
        { name: "file-system", type: "resource", status: "active" },
        { name: "git-operations", type: "resource", status: "active" },
        { name: "web-search", type: "tool", status: "active" },
        { name: "code-execution", type: "tool", status: "sandboxed" },
        { name: "database-query", type: "tool", status: "active" },
        { name: "kafka-producer", type: "tool", status: "active" },
        { name: "aws-s3", type: "resource", status: "active" },
        { name: "github-api", type: "tool", status: "active" },
      ],
    },
    digitalTwin: {
      modules: twinModules,
      status: "syncing",
      description: "Living model of code, infra, data, costs, incidents, docs, meetings",
      views: ["system-topology", "cost-flow", "incident-history", "deployment-graph", "data-lineage"],
    },
    observability: {
      modules: obsModules,
      alerts: obsAlerts,
      dashboards: obsDashboards,
      metrics: obsMetrics,
      status: "collecting",
      description: "OTel-based metrics, logs, traces, alerts and Grafana dashboards",
    },
  });
}
