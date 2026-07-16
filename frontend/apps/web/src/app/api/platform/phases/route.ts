import path from "path";
import fs from "fs";

const ROOT = path.resolve(process.cwd(), "../../..");

// Map phase number to directory/module presence
const PHASE_MODULES: Record<number, string[]> = {
  1:  ["lattix.repository.json", "README.md"],
  2:  ["docker-compose.yml", "scripts/dev"],
  3:  ["terraform"],
  4:  ["kubernetes"],
  5:  ["services/auth-service", "shared/persistence"],
  6:  ["services/workspace-service"],
  7:  ["services/auth-service/src/main/java"],
  8:  ["shared/persistence/src/main/resources/db/migration"],
  9:  ["devops/ci"],
  10: ["frontend/apps/web"],
  11: ["frontend/apps/web/src/components/editor"],
  12: ["ai-platform/repository-intelligence"],
  13: ["ai-platform/code-completion"],
  14: ["knowledge-graph"],
  15: ["memory"],
  16: ["agents/lattix_agents"],
  17: ["services/tool-service"],
  18: ["ai-platform/chat-pipeline"],
  19: ["agents/roles"],
  20: ["devops/ci"],
  21: ["ml-platform"],
  22: ["ml-platform"],
  23: ["devops"],
  24: ["cloud/controllers"],
  25: ["devops/ci", "devops/cd"],
  26: ["observability"],
  27: ["digital-twin"],
  28: ["devops/cache"],
  29: ["devops/database"],
  30: ["devops"],
  31: ["devops"],
  32: ["devops/disaster-recovery"],
  33: ["terraform"],
  34: ["devops/chaos"],
  35: ["devops/security"],
  36: ["devops/security"],
  37: ["devops/performance"],
  38: ["benchmarks"],
  39: ["docs"],
  40: ["docs/implementation-plans"],
};

function checkExists(rel: string): boolean {
  try {
    fs.accessSync(path.resolve(ROOT, rel));
    return true;
  } catch { return false; }
}

const PHASE_META = [
  { phase: 0,  title: "Product Design",           group: "Foundation",     desc: "Architecture, API, data, event, threat and cost design baseline" },
  { phase: 1,  title: "Repository Setup",          group: "Foundation",     desc: "Enterprise monorepo skeleton for all code layers" },
  { phase: 2,  title: "Dev Infrastructure",        group: "Foundation",     desc: "Local dev, Docker, hooks, CI templates, secrets" },
  { phase: 3,  title: "Cloud Infrastructure",      group: "Infrastructure", desc: "Terraform-managed AWS/GCP/Azure foundation" },
  { phase: 4,  title: "Kubernetes Platform",       group: "Infrastructure", desc: "Local and cloud Kubernetes primitives" },
  { phase: 5,  title: "Backend Foundation",        group: "Infrastructure", desc: "Spring Boot microservice foundation" },
  { phase: 6,  title: "API Gateway",               group: "Infrastructure", desc: "Secure, observable, rate-limited edge gateway" },
  { phase: 7,  title: "Authentication",            group: "Infrastructure", desc: "OAuth, RBAC, ABAC, MFA, audit" },
  { phase: 8,  title: "Database Layer",            group: "Infrastructure", desc: "SQL, cache, graph, vector, analytics, object, search" },
  { phase: 9,  title: "Event Platform",            group: "Infrastructure", desc: "Kafka, outbox, retry, saga, CQRS, CDC" },
  { phase: 10, title: "Developer Workspace",       group: "AI Core",        desc: "Web workspace: projects, repos, files, terminal, tasks" },
  { phase: 11, title: "Intelligent Code Editor",   group: "AI Core",        desc: "Monaco editor with parsing, navigation, AI-assisted UX" },
  { phase: 12, title: "Repository Intelligence",   group: "AI Core",        desc: "Code indexing and structural graphs" },
  { phase: 13, title: "Code Completion",           group: "AI Core",        desc: "Repository-aware generation for code, tests, APIs" },
  { phase: 14, title: "Knowledge Graph",           group: "AI Core",        desc: "Neo4j graph: code, people, infra, incidents, decisions" },
  { phase: 15, title: "Memory System",             group: "AI Core",        desc: "Working, semantic, long-term, procedural memory" },
  { phase: 16, title: "Multi-Agent Platform",      group: "AI Core",        desc: "Supervisor, planner, execution, reflection agents" },
  { phase: 17, title: "MCP Tool Ecosystem",        group: "AI Core",        desc: "Model Context Protocol servers and tool integrations" },
  { phase: 18, title: "Intelligent Chatbot",       group: "AI Core",        desc: "Intent, planning, retrieval, reasoning pipeline" },
  { phase: 19, title: "AI Software Engineers",     group: "AI Core",        desc: "Specialized role agents: eng, ops, security, ML, incident" },
  { phase: 20, title: "Data Engineering",          group: "Data",           desc: "Kafka, Flink, Spark, Airflow, lakehouse, feature store" },
  { phase: 21, title: "ML Platform",               group: "Data",           desc: "Predictive models, MLflow, training, evaluation, serving" },
  { phase: 22, title: "Computer Vision",           group: "Data",           desc: "Diagram, screenshot, OCR, UI-to-code understanding" },
  { phase: 23, title: "Signal Processing",         group: "Data",           desc: "Speech, audio, alarms, meeting intelligence" },
  { phase: 24, title: "Cloud Controllers",         group: "Infrastructure", desc: "AWS/GCP/Azure provision, deploy, scale, repair loops" },
  { phase: 25, title: "CI/CD Platform",            group: "Infrastructure", desc: "Build, test, scan, AI review, deploy, canary, blue-green" },
  { phase: 26, title: "Observability",             group: "Observability",  desc: "Metrics, logs, traces, dashboards, alerts, OTel" },
  { phase: 27, title: "Digital Twin",              group: "Reliability",    desc: "Living model of code, infra, costs, incidents, decisions" },
  { phase: 28, title: "Distributed Caching",       group: "Reliability",    desc: "Redis Cluster, cache policy, invalidation, warming" },
  { phase: 29, title: "Database Scaling",          group: "Reliability",    desc: "Read replicas, sharding, partitioning" },
  { phase: 30, title: "Traffic Control",           group: "Reliability",    desc: "Rate limiting, adaptive load balancing, CDN" },
  { phase: 31, title: "Service Mesh",              group: "Reliability",    desc: "Mesh performance, routing, security, telemetry" },
  { phase: 32, title: "Disaster Recovery",         group: "Reliability",    desc: "Backup, restore, failover, runbooks, RTO/RPO" },
  { phase: 33, title: "Multi-Region",              group: "Reliability",    desc: "Active-active or active-passive regional architecture" },
  { phase: 34, title: "Chaos Engineering",         group: "Reliability",    desc: "Fault injection, resilience experiments" },
  { phase: 35, title: "Security Hardening",        group: "Security",       desc: "Zero trust, secrets, runtime security, supply chain" },
  { phase: 36, title: "Compliance & Audit",        group: "Security",       desc: "SOC2/GDPR architecture, evidence, retention" },
  { phase: 37, title: "Performance Benchmarking",  group: "Enterprise",     desc: "Load, stress, soak, capacity, regression" },
  { phase: 38, title: "Cost Optimization",         group: "Enterprise",     desc: "Cost modeling, forecasting, rightsizing" },
  { phase: 39, title: "Docs Portal & SDKs",        group: "Enterprise",     desc: "Developer docs, SDKs, CLI, examples" },
  { phase: 40, title: "Production Readiness",      group: "Enterprise",     desc: "Final readiness gates, operations model, launch" },
];

export async function GET() {
  const phases = PHASE_META.map((p) => {
    const modules = PHASE_MODULES[p.phase] ?? [];
    const implemented = modules.some((m) => checkExists(m));
    return { ...p, implemented, modules };
  });

  return Response.json({ phases });
}
