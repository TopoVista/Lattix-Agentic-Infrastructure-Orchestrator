"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  collectDiagnostics,
  findReferences,
  findSymbols,
  listAiSuggestions,
  loadCodeGraphs,
  openEditorFile,
  parseIncrementally,
  previewRename,
  requestInlineExplanation
} from "@lattix/code-intelligence";
import { EditorToolbar } from "./editor-toolbar";
import { CodeEditor } from "./code-editor";
import { SymbolSearch } from "./symbol-search";
import { AstViewer } from "./ast-viewer";
import { ReferencePanel } from "./reference-panel";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { GraphPanel } from "./graph-panel";
import { AiSuggestions } from "./ai-suggestions";
import { Card, CardBody } from "@/components/ui/card";
import { useWorkspaceStore } from "@/lib/store";
import type { FileTreeNode, RepositorySummary } from "@/lib/types";

export function EditorWorkspace({
  repository,
  tree
}: {
  repository: RepositorySummary;
  tree: FileTreeNode[];
}) {
  const selectedFilePath = useWorkspaceStore((state) => state.selectedFilePath);
  const setFilePath = useWorkspaceStore((state) => state.setFilePath);
  const filePaths = useMemo(() => collectFilePaths(tree), [tree]);
  const [activeFilePath, setActiveFilePath] = useState(selectedFilePath);
  const [editorFile, setEditorFile] = useState<Awaited<ReturnType<typeof openEditorFile>> | null>(null);
  const [draft, setDraft] = useState("");
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof parseIncrementally>> | null>(null);
  const previousSnapshotRef = useRef<Awaited<ReturnType<typeof parseIncrementally>> | null>(null);
  const [diagnostics, setDiagnostics] = useState<Awaited<ReturnType<typeof collectDiagnostics>>>([]);
  const [graph, setGraph] = useState<Awaited<ReturnType<typeof loadCodeGraphs>> | null>(null);
  const [suggestions, setSuggestions] = useState<Awaited<ReturnType<typeof listAiSuggestions>>>([]);
  const [symbols, setSymbols] = useState<Awaited<ReturnType<typeof findSymbols>>>([]);
  const [symbolQuery, setSymbolQuery] = useState("");
  const [activeSymbolName, setActiveSymbolName] = useState<string | null>(null);
  const [references, setReferences] = useState<Awaited<ReturnType<typeof findReferences>>>([]);
  const [explanation, setExplanation] = useState<Awaited<ReturnType<typeof requestInlineExplanation>> | null>(null);

  useEffect(() => {
    setActiveFilePath(selectedFilePath);
  }, [selectedFilePath]);

  useEffect(() => {
    setFilePath(activeFilePath);
  }, [activeFilePath, setFilePath]);

  useEffect(() => {
    let cancelled = false;

    async function loadFile() {
      const nextFile = await openEditorFile({
        repositoryId: repository.id,
        path: activeFilePath,
        workspaceId: "ws-lattix"
      });

      if (cancelled) {
        return;
      }

      setEditorFile(nextFile);
      setDraft(nextFile.content);

      const [nextSnapshot, nextDiagnostics, nextGraph, nextSuggestions] = await Promise.all([
        parseIncrementally({ file: nextFile, previousSnapshot: previousSnapshotRef.current ?? undefined }),
        collectDiagnostics(nextFile),
        loadCodeGraphs({ repositoryId: repository.id }),
        listAiSuggestions({ path: nextFile.path })
      ]);

      if (cancelled) {
        return;
      }

      setSnapshot(nextSnapshot);
      previousSnapshotRef.current = nextSnapshot;
      setDiagnostics(nextDiagnostics);
      setGraph(nextGraph);
      setSuggestions(nextSuggestions);
    }

    void loadFile();

    return () => {
      cancelled = true;
    };
  }, [activeFilePath, repository.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadSymbols() {
      if (!editorFile) {
        setSymbols([]);
        setActiveSymbolName(null);
        return;
      }

      const nextSymbols = await findSymbols({
        workspaceId: "ws-lattix",
        repositoryId: repository.id,
        query: symbolQuery,
        language: editorFile.language,
        path: editorFile.path
      });

      if (cancelled) {
        return;
      }

      setSymbols(nextSymbols);
      setActiveSymbolName(nextSymbols[0]?.name ?? null);
    }

    void loadSymbols();

    return () => {
      cancelled = true;
    };
  }, [editorFile, repository.id, symbolQuery]);

  useEffect(() => {
    let cancelled = false;

    async function loadSymbolContext() {
      if (!activeSymbolName) {
        setReferences([]);
        setExplanation(null);
        return;
      }

      const activeSymbol = symbols.find((symbol) => symbol.name === activeSymbolName) ?? symbols[0];
      if (!activeSymbol) {
        setReferences([]);
        setExplanation(null);
        return;
      }

      const [nextReferences, nextExplanation, renamePreview] = await Promise.all([
        findReferences({
          workspaceId: "ws-lattix",
          repositoryId: repository.id,
          symbolName: activeSymbol.name
        }),
        requestInlineExplanation({
          workspaceId: "ws-lattix",
          repositoryId: repository.id,
          path: editorFile?.path ?? activeFilePath,
          selection: {
            startLine: activeSymbol.range.startLine,
            startColumn: activeSymbol.range.startColumn,
            endLine: activeSymbol.range.endLine,
            endColumn: activeSymbol.range.endColumn
          },
          surroundingCode: editorFile?.content ?? draft
        }),
        previewRename({
          workspaceId: "ws-lattix",
          repositoryId: repository.id,
          symbolName: activeSymbol.name,
          newName: `${activeSymbol.name}Next`,
          path: activeSymbol.path
        })
      ]);

      if (cancelled) {
        return;
      }

      setReferences(nextReferences);
      setExplanation({
        ...nextExplanation,
        suggestedActions: [
          ...nextExplanation.suggestedActions,
          renamePreview.conflicts.length ? "Resolve rename conflicts before applying." : "Rename preview looks clear."
        ]
      });
    }

    void loadSymbolContext();

    return () => {
      cancelled = true;
    };
  }, [activeSymbolName, activeFilePath, editorFile, draft, repository.id, symbols]);

  const selectedSymbol = symbols.find((symbol) => symbol.name === activeSymbolName) ?? symbols[0] ?? null;

  return (
    <div className="space-y-4">
      <EditorToolbar
        repositoryName={repository.name}
        activeFilePath={activeFilePath}
        files={filePaths}
        file={editorFile}
        onSelectFile={(path) => {
          setActiveFilePath(path);
          setSymbolQuery("");
        }}
        onExplain={() => {
          if (selectedSymbol) {
            setActiveSymbolName(selectedSymbol.name);
          }
        }}
        onRequestRename={() => {
          if (selectedSymbol) {
            setActiveSymbolName(selectedSymbol.name);
          }
        }}
      />

      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-4">
          {editorFile ? <CodeEditor file={editorFile} draft={draft} onChange={setDraft} /> : <Card><CardBody className="p-6 text-sm text-muted">Loading file...</CardBody></Card>}
          <div className="grid gap-4 xl:grid-cols-2">
            <AstViewer snapshot={snapshot} />
            <GraphPanel graph={graph} />
          </div>
        </div>

        <div className="space-y-4">
          <SymbolSearch
            query={symbolQuery}
            onQueryChange={setSymbolQuery}
            symbols={symbols}
            activeSymbolName={selectedSymbol?.name ?? null}
            onSelectSymbol={(symbol) => setActiveSymbolName(symbol.name)}
          />
          <ReferencePanel symbolName={selectedSymbol?.name ?? null} references={references} />
          <DiagnosticsPanel diagnostics={diagnostics} />
          <AiSuggestions explanation={explanation} suggestions={suggestions} />
        </div>
      </div>
    </div>
  );
}

function collectFilePaths(nodes: FileTreeNode[]): string[] {
  const result: string[] = [];

  for (const node of nodes) {
    if (node.type === "file") {
      result.push(node.path);
    }
    if (node.children?.length) {
      result.push(...collectFilePaths(node.children));
    }
  }

  return Array.from(new Set(result)).slice(0, 5);
}
