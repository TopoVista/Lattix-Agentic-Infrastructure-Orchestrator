"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TerminalSquare, Trash2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useWorkspaceStore } from "@/lib/store";

type Line = { type: "input" | "output" | "error"; text: string };

export function TerminalPanel() {
  const history = useWorkspaceStore((s) => s.terminalHistory);
  const push = useWorkspaceStore((s) => s.pushTerminalLine);
  const clearHistory = useWorkspaceStore((s) => s.clearTerminalHistory);
  const currentAccount = useWorkspaceStore((s) => s.currentAccount);

  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const prompt = `${currentAccount().email.split("@")[0]}@lattix:~$`;

  const runCommand = useCallback(
    async (cmd: string) => {
      if (!cmd.trim()) return;
      push({ type: "input", text: cmd });
      setCmdHistory((h) => [cmd, ...h]);
      setHistIdx(-1);
      setInput("");
      setRunning(true);

      try {
        const res = await fetch("/api/terminal", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ command: cmd }),
        });
        const data = (await res.json()) as { stdout: string; stderr: string; exitCode: number };

        if (data.stdout === "__CLEAR__") {
          clearHistory();
        } else {
          if (data.stdout.trim()) {
            data.stdout.split("\n").forEach((line) => push({ type: "output", text: line }));
          }
          if (data.stderr.trim()) {
            data.stderr.split("\n").forEach((line) => push({ type: "error", text: line }));
          }
          if (!data.stdout.trim() && !data.stderr.trim()) {
            push({ type: "output", text: "(no output)" });
          }
        }
      } catch (e) {
        push({ type: "error", text: `[network error] ${String(e)}` });
      } finally {
        setRunning(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [push, clearHistory, currentAccount]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIdx((i) => {
        const next = Math.min(i + 1, cmdHistory.length - 1);
        setInput(cmdHistory[next] ?? "");
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIdx((i) => {
        const next = Math.max(i - 1, -1);
        setInput(next === -1 ? "" : (cmdHistory[next] ?? ""));
        return next;
      });
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      clearHistory();
    }
  };

  const lineColor = (type: Line["type"]) => {
    if (type === "input") return "text-[#7dd3fc]";
    if (type === "error") return "text-[#f87171]";
    return "text-[#a3e635]";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TerminalSquare className="size-4 text-accent2" />
            Terminal
            {running && (
              <span className="ml-2 animate-pulse text-xs text-muted">running…</span>
            )}
          </div>
          <button
            onClick={clearHistory}
            title="Clear terminal (Ctrl+L)"
            className="rounded p-1 text-muted hover:text-text"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {/* Output area */}
        <div
          className="h-[480px] overflow-y-auto bg-[#060d1a] p-4 font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <div key={i} className={lineColor(line.type)}>
              {line.type === "input" ? (
                <span>
                  <span className="text-[#e879f9]">{prompt}</span>{" "}
                  <span className="text-[#f8fafc]">{line.text}</span>
                </span>
              ) : (
                <span className="whitespace-pre-wrap">{line.text}</span>
              )}
            </div>
          ))}
          {/* Prompt line */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[#e879f9] select-none">{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={running}
              autoFocus
              className="flex-1 bg-transparent text-[#f8fafc] caret-[#e879f9] outline-none"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-line bg-[#080f1e] px-4 py-1.5 font-mono text-[11px] text-muted">
          ↑↓ history · Enter run · Ctrl+L clear · Working dir: project root
        </div>
      </CardBody>
    </Card>
  );
}
