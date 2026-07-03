"use client";

import { CheckCircle2, Circle, CircleDashed, OctagonAlert } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { TaskStatus, WorkspaceTask } from "@/lib/types";

const columns: { status: TaskStatus; label: string; icon: React.ReactNode }[] = [
  { status: "todo", label: "To do", icon: <Circle className="size-4 text-muted" /> },
  { status: "in_progress", label: "In progress", icon: <CircleDashed className="size-4 text-accent" /> },
  { status: "blocked", label: "Blocked", icon: <OctagonAlert className="size-4 text-warning" /> },
  { status: "done", label: "Done", icon: <CheckCircle2 className="size-4 text-accent2" /> }
];

export function TaskBoard({ tasks }: { tasks: WorkspaceTask[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => (
        <Card key={column.status}>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold">
              {column.icon}
              {column.label}
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            {tasks.filter((task) => task.status === column.status).map((task) => (
              <div key={task.id} className="rounded-md border border-line bg-[#10192e] p-3">
                <div className="text-sm font-medium">{task.title}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">{task.priority}</div>
                <div className="mt-1 text-sm text-muted">Assigned to {task.assignee}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
