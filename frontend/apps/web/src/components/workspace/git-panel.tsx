"use client";

import { GitBranch, GitCommitHorizontal, Link2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { GitBranch as GitBranchType, GitCommit } from "@/lib/types";

export function GitPanel({ branches, commits }: { branches: GitBranchType[]; commits: GitCommit[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <GitBranch className="size-4 text-accent" />
          Git
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <section>
          <div className="text-xs uppercase tracking-[0.16em] text-muted">Branches</div>
          <div className="mt-2 space-y-2">
            {branches.map((branch) => (
              <div key={branch.name} className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{branch.name}</div>
                  {branch.isCurrent ? <span className="text-xs text-accent">current</span> : null}
                </div>
                <div className="mt-1 text-xs text-muted">
                  ahead {branch.ahead} / behind {branch.behind}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="text-xs uppercase tracking-[0.16em] text-muted">Recent commits</div>
          <div className="mt-2 space-y-2">
            {commits.map((commit) => (
              <div key={commit.sha} className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="flex items-start gap-2">
                  <GitCommitHorizontal className="size-4 text-accent2" />
                  <div>
                    <div className="text-sm font-medium">{commit.message}</div>
                    <div className="mt-1 text-xs text-muted">
                      {commit.sha} · {commit.author} · {commit.committedAt}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="rounded-md border border-line bg-[#10192e] p-3 text-sm text-muted">
          <div className="flex items-center gap-2 text-text">
            <Link2 className="size-4 text-warning" />
            Remote links are contract-ready
          </div>
          Branch protection, PR status, and deployment links will bind to backend data in a later phase.
        </div>
      </CardBody>
    </Card>
  );
}
