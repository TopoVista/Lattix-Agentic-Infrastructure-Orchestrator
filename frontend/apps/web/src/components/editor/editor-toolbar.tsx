"use client";

import { FileCode2, PlaySquare, Sparkles, Braces, FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EditorFile } from "@lattix/code-intelligence";

export function EditorToolbar({
  repositoryName,
  activeFilePath,
  files,
  file,
  onSelectFile,
  onExplain,
  onRequestRename
}: {
  repositoryName: string;
  activeFilePath: string;
  files: string[];
  file: EditorFile | null;
  onSelectFile: (path: string) => void;
  onExplain: () => void;
  onRequestRename: () => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-line bg-panel p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileCode2 className="size-4 text-accent" />
            {repositoryName}
          </div>
          <div className="mt-1 text-xs text-muted">{activeFilePath}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{file?.revision ?? "loading revision"}</Badge>
          <Badge className={file?.permissions.canEdit ? "border-accent/40 text-accent2" : "border-line text-muted"}>{file?.permissions.canEdit ? "editor enabled" : "review mode"}</Badge>
          <Button type="button" onClick={onExplain}>
            <Sparkles className="size-4" />
            Explain
          </Button>
          <Button type="button" onClick={onRequestRename}>
            <Braces className="size-4" />
            Rename preview
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {files.map((path) => (
          <button
            key={path}
            type="button"
            onClick={() => onSelectFile(path)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition",
              path === activeFilePath ? "border-accent/50 bg-[#17223d] text-text" : "border-line bg-[#10192e] text-muted hover:text-text"
            )}
          >
            <FileSearch className="size-3.5" />
            {path.split("/").pop()}
          </button>
        ))}
        <div className="inline-flex items-center gap-2 rounded-md border border-line bg-[#10192e] px-3 py-1.5 text-sm text-muted">
          <PlaySquare className="size-3.5" />
          Tree-sitter, symbols, diagnostics, and graphs are all wired into the same editor state.
        </div>
      </div>
    </div>
  );
}
