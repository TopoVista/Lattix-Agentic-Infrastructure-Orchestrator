"use client";

import { useEffect, useState } from "react";
import { GitBranch as GitBranchIcon, GitCommit, Copy, RefreshCw } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

type Commit = { sha: string; message: string; author: string; committedAt: string };
type Branch = { name: string; isCurrent: boolean; ahead: number; behind: number };

export function GitPanel() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [commitRes, branchRes] = await Promise.all([
        fetch("/api/git/log"),
        fetch("/api/git/branches"),
      ]);
      const [c, b] = await Promise.all([commitRes.json(), branchRes.json()]);
      setCommits(c ?? []);
      setBranches(b ?? []);
    } catch {
      // silently fail — keep existing data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const copySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopied(sha);
    setTimeout(() => setCopied(null), 1500);
  };

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  return (
    <div className="space-y-4">
      {/* Branches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <GitBranchIcon className="size-4 text-accent2" />
              Branches
            </div>
            <button onClick={load} disabled={loading} title="Refresh" className="rounded p-1 text-muted hover:text-text disabled:opacity-40">
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </CardHeader>
        <CardBody className="space-y-2">
          {branches.length === 0 && !loading && (
            <p className="text-sm text-muted">No branches found.</p>
          )}
          {branches.slice(0, 8).map((b) => (
            <div key={b.name} className="flex items-center justify-between rounded-md border border-line bg-[#10192e] px-3 py-2">
              <div className="flex items-center gap-2">
                {b.isCurrent && <span className="size-1.5 rounded-full bg-accent2 inline-block" />}
                <span className={`text-sm font-mono ${b.isCurrent ? "text-text" : "text-muted"}`}>{b.name}</span>
              </div>
              {b.isCurrent && (
                <span className="text-xs text-accent2 font-medium">current</span>
              )}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Commits */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <GitCommit className="size-4 text-accent" />
            Recent Commits ({commits.length})
          </div>
        </CardHeader>
        <CardBody className="space-y-2 max-h-[480px] overflow-y-auto">
          {commits.length === 0 && !loading && (
            <p className="text-sm text-muted">No commits found.</p>
          )}
          {commits.map((c) => (
            <div key={c.sha} className="rounded-md border border-line bg-[#10192e] px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium text-text leading-snug">{c.message}</div>
                <button
                  onClick={() => copySha(c.sha)}
                  title="Copy SHA"
                  className="shrink-0 rounded px-1.5 py-0.5 font-mono text-xs text-muted hover:text-accent2 border border-transparent hover:border-line"
                >
                  {copied === c.sha ? "✓" : c.sha}
                </button>
              </div>
              <div className="mt-1 text-xs text-muted">
                {c.author} · {fmt(c.committedAt)}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
