"use client";

import dynamic from "next/dynamic";
import type { EditorFile } from "@lattix/code-intelligence";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MonacoEditor = dynamic(async () => (await import("@monaco-editor/react")).default, {
  ssr: false,
  loading: () => <div className="rounded-md border border-line bg-[#09111f] p-4 text-sm text-muted">Loading Monaco editor...</div>
});

export function CodeEditor({
  file,
  draft,
  onChange
}: {
  file: EditorFile;
  draft: string;
  onChange: (value: string) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Code editor</div>
            <div className="mt-1 text-xs text-muted">{file.path}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{file.language}</Badge>
            <Badge className={file.permissions.canEdit ? "border-accent/40 text-accent2" : "border-line text-muted"}>{file.permissions.canEdit ? "editable" : "read only"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="border-y border-line bg-[#08101f]">
          <MonacoEditor
            height="620px"
            theme="vs-dark"
            language={file.language === "tsx" ? "typescript" : file.language}
            value={draft}
            onChange={(value) => onChange(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              renderWhitespace: "selection",
              tabSize: 2,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              readOnly: !file.permissions.canEdit
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
}
