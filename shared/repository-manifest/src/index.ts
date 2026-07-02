import { readFile } from "node:fs/promises";
import path from "node:path";

export interface WorkspacePathInput {
  repoRoot: string;
  requestedPath: string;
}

export interface WorkspacePath {
  repoRoot: string;
  requestedPath: string;
  absolutePath: string;
  relativePath: string;
}

export interface ModuleDescriptor {
  path: string;
  type: string;
  runtime: string;
  owner: string;
  phaseStart: number;
  publicInterfaces: string[];
}

export interface BoundaryRule {
  source: string;
  allowedTargets: string[];
  forbiddenTargets: string[];
  enforcement: "documented" | "warning" | "error";
}

export interface RepositoryManifest {
  name: string;
  version: string;
  phase: string;
  languages: Record<string, unknown>;
  modules: ModuleDescriptor[];
  boundaryRules: BoundaryRule[];
}

export interface BoundaryCheckInput {
  manifest: RepositoryManifest;
  sourceModule: string;
  targetModule: string;
}

export interface BoundaryCheckResult {
  allowed: boolean;
  enforcement: BoundaryRule["enforcement"] | "none";
  violations: string[];
  warnings: string[];
}

export function resolveWorkspacePath(input: WorkspacePathInput): WorkspacePath {
  const repoRoot = path.resolve(input.repoRoot);
  const absolutePath = path.resolve(repoRoot, input.requestedPath);
  const relativePath = path.relative(repoRoot, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Path escapes repository root: ${input.requestedPath}`);
  }

  return {
    repoRoot,
    requestedPath: input.requestedPath,
    absolutePath,
    relativePath: normalizePath(relativePath === "" ? "." : relativePath)
  };
}

export async function loadRepositoryManifest(manifestPath: string): Promise<RepositoryManifest> {
  const contents = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(contents) as RepositoryManifest;
  validateRepositoryManifestShape(manifest);
  return manifest;
}

export function validateModuleBoundary(input: BoundaryCheckInput): BoundaryCheckResult {
  const sourceExists = input.manifest.modules.some((module) => module.path === input.sourceModule);
  const targetExists = input.manifest.modules.some((module) => module.path === input.targetModule);
  const rule = input.manifest.boundaryRules.find((candidate) => candidate.source === input.sourceModule);
  const violations: string[] = [];
  const warnings: string[] = [];

  if (!sourceExists) {
    violations.push(`Unknown source module: ${input.sourceModule}`);
  }

  if (!targetExists) {
    violations.push(`Unknown target module: ${input.targetModule}`);
  }

  if (!rule) {
    warnings.push(`No boundary rule is documented for source module: ${input.sourceModule}`);
    return {
      allowed: violations.length === 0,
      enforcement: "none",
      violations,
      warnings
    };
  }

  if (rule.forbiddenTargets.includes(input.targetModule)) {
    violations.push(`${input.sourceModule} must not depend on ${input.targetModule}`);
  }

  if (!rule.allowedTargets.includes(input.targetModule) && !rule.forbiddenTargets.includes(input.targetModule)) {
    warnings.push(`${input.sourceModule} has no explicit boundary decision for ${input.targetModule}`);
  }

  return {
    allowed: violations.length === 0,
    enforcement: rule.enforcement,
    violations,
    warnings
  };
}

function validateRepositoryManifestShape(manifest: RepositoryManifest): void {
  if (!manifest.name || !manifest.version || !manifest.phase) {
    throw new Error("Repository manifest must include name, version, and phase.");
  }

  if (!Array.isArray(manifest.modules) || manifest.modules.length === 0) {
    throw new Error("Repository manifest must include at least one module.");
  }

  if (!Array.isArray(manifest.boundaryRules)) {
    throw new Error("Repository manifest boundaryRules must be an array.");
  }
}

function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}
