"use client";

import Link from "next/link";
import { ChevronRight, FileCode2, FolderTree } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FileTreeNode, FileContent, RepositorySummary } from "@/lib/types";
import { useWorkspaceStore } from "@/lib/store";

export function RepositoryBrowser({
  repository,
  tree,
  fileContent
}: {
  repository: RepositorySummary;
  tree: FileTreeNode[];
  fileContent: FileContent;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FolderTree className="size-4 text-accent" />
            File Explorer
          </div>
        </CardHeader>
        <CardBody>
          <TreeList nodes={tree} level={0} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileCode2 className="size-4 text-accent2" />
            {repository.name} / {fileContent.path}
          </div>
        </CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-line bg-[#08101f] p-4 text-sm leading-6 text-text">{fileContent.content}</pre>
        </CardBody>
      </Card>
    </div>
  );
}

function TreeList({ nodes, level }: { nodes: FileTreeNode[]; level: number }) {
  const selectedFilePath = useWorkspaceStore((state) => state.selectedFilePath);
  const setFilePath = useWorkspaceStore((state) => state.setFilePath);

  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <div key={node.path}>
          <button
            onClick={() => node.type === "file" && setFilePath(node.path)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-panelSoft",
              node.type === "file" && selectedFilePath === node.path && "bg-panelSoft text-accent"
            )}
            style={{ paddingLeft: `${level * 14 + 8}px` }}
          >
            <ChevronRight className={cn("size-3 text-muted", node.type === "directory" && "rotate-90")} />
            <span className="truncate">{node.name}</span>
          </button>
          {node.children?.length ? <TreeList nodes={node.children} level={level + 1} /> : null}
        </div>
      ))}
    </div>
  );
}
