import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

export interface DoctorCheckInput {
  repoRoot: string;
  strict?: boolean;
  requiredTools?: string[];
  optionalTools?: string[];
}

export interface ToolCheck {
  name: string;
  available: boolean;
  version?: string;
  required: boolean;
}

export interface DoctorCheckReport {
  ok: boolean;
  tools: ToolCheck[];
  envFiles: string[];
  failures: string[];
}

export interface EnvProfile {
  name: string;
  files: string[];
  composeProfiles: string[];
  enabledServices: string[];
  variables: Record<string, string>;
}

export interface CommitValidationResult {
  valid: boolean;
  type?: string;
  scope?: string;
  subject?: string;
  errors: string[];
}

export type DependencyName = "core" | "data" | "observability";

export interface DependencyStatus {
  name: DependencyName;
  command: string[];
  executed: boolean;
  exitCode?: number;
}

const defaultRequiredTools = ["git", "node", "python"];
const defaultOptionalTools = ["pnpm", "java", "docker", "terraform", "kubectl", "helm", "pre-commit", "gitleaks"];

export function runDoctorCheck(input: DoctorCheckInput): DoctorCheckReport {
  const requiredTools = input.requiredTools ?? defaultRequiredTools;
  const optionalTools = input.optionalTools ?? defaultOptionalTools;
  const tools = [
    ...requiredTools.map((name) => checkTool(name, true)),
    ...optionalTools.map((name) => checkTool(name, false))
  ];
  const envFiles = ["config/env/local.env.example", "config/env/services.env.example"];
  const failures: string[] = [];

  for (const envFile of envFiles) {
    if (!existsSync(path.join(input.repoRoot, envFile))) {
      failures.push(`Missing environment example: ${envFile}`);
    }
  }

  for (const tool of tools) {
    if (tool.required && !tool.available) {
      failures.push(`Missing required tool: ${tool.name}`);
    }
  }

  return {
    ok: failures.length === 0 || input.strict !== true,
    tools,
    envFiles,
    failures
  };
}

export function loadEnvProfile(profile: string, repoRoot = process.cwd()): EnvProfile {
  const profilePath = path.join(repoRoot, "config/env/profiles.json");
  const profiles = JSON.parse(readFileSync(profilePath, "utf8")) as { profiles: Omit<EnvProfile, "variables">[] };
  const match = profiles.profiles.find((candidate) => candidate.name === profile);

  if (!match) {
    throw new Error(`Unknown environment profile: ${profile}`);
  }

  const variables: Record<string, string> = {};

  for (const file of match.files) {
    const absolutePath = path.join(repoRoot, file);
    const contents = readFileSync(absolutePath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex);
      const value = trimmed.slice(separatorIndex + 1);
      variables[key] = value;
    }
  }

  return { ...match, variables };
}

export function validateCommitMessage(message: string): CommitValidationResult {
  const firstLine = message.split(/\r?\n/)[0]?.trim() ?? "";
  const match = /^(feat|fix|docs|test|refactor|perf|build|ci|chore|security)(?:\(([a-z0-9-]+)\))?!?: (.+)$/.exec(firstLine);
  const errors: string[] = [];

  if (!match) {
    errors.push("Commit message must follow Conventional Commits: type(scope): subject");
    return { valid: false, errors };
  }

  const type = match[1]!;
  const scope = match[2];
  const subject = match[3]!;
  if (subject.length < 3) {
    errors.push("Commit subject must be at least 3 characters.");
  }

  const result: CommitValidationResult = {
    valid: errors.length === 0,
    type,
    subject,
    errors
  };

  if (scope) {
    result.scope = scope;
  }

  return result;
}

export function startLocalDependency(name: DependencyName, execute = false, repoRoot = process.cwd()): DependencyStatus {
  const profile = loadEnvProfile(name, repoRoot);
  const command = ["docker", "compose", ...profile.composeProfiles.flatMap((entry) => ["--profile", entry]), "up", "-d"];

  if (!execute) {
    return { name, command, executed: false };
  }

  const result = spawnSync(command[0]!, command.slice(1), {
    cwd: repoRoot,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  return {
    name,
    command,
    executed: true,
    exitCode: result.status ?? 1
  };
}

function checkTool(name: string, required: boolean): ToolCheck {
  const version = spawnSync(name, ["--version"], {
    encoding: "utf8",
    shell: process.platform === "win32"
  });

  const available = version.status === 0;
  const check: ToolCheck = {
    name,
    available,
    required
  };

  if (available) {
    check.version = firstLine(version.stdout || version.stderr);
  }

  return check;
}

function firstLine(value: string): string {
  return value.split(/\r?\n/).find(Boolean)?.trim() ?? "";
}
