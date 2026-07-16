"use client";

import { useState } from "react";
import { CheckCircle2, Circle, CircleDashed, OctagonAlert, Plus, Trash2, ChevronDown } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { TaskPriority, TaskStatus, WorkspaceTask } from "@/lib/types";
import { useWorkspaceStore } from "@/lib/store";

const COLUMNS: { status: TaskStatus; label: string; icon: React.ReactNode }[] = [
  { status: "todo", label: "To do", icon: <Circle className="size-4 text-muted" /> },
  { status: "in_progress", label: "In progress", icon: <CircleDashed className="size-4 text-accent" /> },
  { status: "blocked", label: "Blocked", icon: <OctagonAlert className="size-4 text-warning" /> },
  { status: "done", label: "Done", icon: <CheckCircle2 className="size-4 text-accent2" /> },
];

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];
const STATUSES: TaskStatus[] = ["todo", "in_progress", "blocked", "done"];

function AddTaskModal({ onClose }: { onClose: () => void }) {
  const addTask = useWorkspaceStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const submit = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), priority, assignee: assignee.trim() || "Unassigned", status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-line bg-[#0c1224] p-6 shadow-2xl">
        <h2 className="mb-4 text-base font-semibold text-text">Create Task</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted">Title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Task title…"
              className="w-full rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-accent/60"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text outline-none"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text outline-none"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Assignee</label>
            <input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Unassigned"
              className="w-full rounded-md border border-line bg-[#10192e] px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-accent/60"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-line px-3 py-2 text-sm text-muted hover:text-text">Cancel</button>
          <button
            onClick={submit}
            disabled={!title.trim()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#060d1a] hover:bg-accent/90 disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: WorkspaceTask }) {
  const updateTaskStatus = useWorkspaceStore((s) => s.updateTaskStatus);
  const deleteTask = useWorkspaceStore((s) => s.deleteTask);
  const [showMove, setShowMove] = useState(false);

  const priorityColor =
    task.priority === "urgent" ? "text-danger" :
    task.priority === "high" ? "text-warning" :
    task.priority === "medium" ? "text-accent" : "text-muted";

  return (
    <div className="group relative rounded-md border border-line bg-[#10192e] p-3 hover:border-accent/30 transition">
      <div className="pr-6 text-sm font-medium text-text leading-snug">{task.title}</div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs uppercase tracking-[0.12em] font-medium ${priorityColor}`}>{task.priority}</span>
        <span className="text-xs text-muted">{task.assignee}</span>
      </div>
      {/* Actions */}
      <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
        <div className="relative">
          <button
            onClick={() => setShowMove((v) => !v)}
            title="Move to…"
            className="rounded p-1 text-muted hover:text-accent"
          >
            <ChevronDown className="size-3.5" />
          </button>
          {showMove && (
            <div className="absolute right-0 top-6 z-10 w-36 rounded-md border border-line bg-[#0c1224] py-1 shadow-xl">
              {STATUSES.filter((s) => s !== task.status).map((s) => (
                <button
                  key={s}
                  onClick={() => { updateTaskStatus(task.id, s); setShowMove(false); }}
                  className="block w-full px-3 py-1.5 text-left text-xs text-muted hover:bg-[#17223d] hover:text-text"
                >
                  → {s.replace("_", " ")}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => deleteTask(task.id)} title="Delete" className="rounded p-1 text-muted hover:text-danger">
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function TaskBoard() {
  const tasks = useWorkspaceStore((s) => s.tasks);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Task Board — {tasks.length} tasks</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
          >
            <Plus className="size-3.5" /> New Task
          </button>
        </div>
        <div className="grid gap-4 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);
            return (
              <Card key={col.status}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {col.icon}
                      {col.label}
                    </div>
                    <span className="text-xs text-muted">{colTasks.length}</span>
                  </div>
                </CardHeader>
                <CardBody className="space-y-2 min-h-[80px]">
                  {colTasks.length === 0 && (
                    <p className="text-xs text-muted/60 py-2 text-center">Empty</p>
                  )}
                  {colTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
