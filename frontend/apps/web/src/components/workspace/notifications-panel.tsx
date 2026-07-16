"use client";

import { useState } from "react";
import { Bell, X, CheckCheck, Trash2, CircleDot } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useWorkspaceStore } from "@/lib/store";

export function NotificationsPanel() {
  const notifications = useWorkspaceStore((s) => s.notifications);
  const markRead = useWorkspaceStore((s) => s.markNotificationRead);
  const dismiss = useWorkspaceStore((s) => s.dismissNotification);
  const clearAll = useWorkspaceStore((s) => s.clearAllNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const severityColor = (sev: string) =>
    sev === "critical" ? "text-danger" : sev === "warning" ? "text-warning" : "text-accent2";

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    catch { return ""; }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Bell className="size-4 text-warning" />
            Notifications
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs text-warning font-medium">
                {notifications.filter((n) => !n.read).length} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter(filter === "all" ? "unread" : "all")}
              className="rounded border border-line px-2 py-1 text-xs text-muted hover:text-text"
            >
              {filter === "all" ? "Unread only" : "Show all"}
            </button>
            {notifications.length > 0 && (
              <button onClick={clearAll} title="Clear all" className="rounded p-1 text-muted hover:text-danger">
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-2 max-h-[600px] overflow-y-auto">
        {visible.length === 0 && (
          <div className="py-8 text-center text-sm text-muted">
            {filter === "unread" ? "No unread notifications." : "No notifications."}
          </div>
        )}
        {visible.map((n) => (
          <div
            key={n.id}
            className={`group relative rounded-md border p-3 transition ${
              n.read ? "border-line bg-[#0d1428] opacity-60" : "border-accent/20 bg-[#10192e]"
            }`}
          >
            <div className="flex items-start gap-2 pr-12">
              <CircleDot className={`mt-0.5 size-3 shrink-0 ${severityColor(n.severity)}`} />
              <div>
                <div className="text-sm font-medium text-text">{n.title}</div>
                <div className="mt-0.5 text-sm text-muted">{n.body}</div>
                <div className="mt-1 text-xs text-muted/60">{fmt(n.createdAt)}</div>
              </div>
            </div>
            <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
              {!n.read && (
                <button onClick={() => markRead(n.id)} title="Mark as read" className="rounded p-1 text-muted hover:text-accent2">
                  <CheckCheck className="size-3.5" />
                </button>
              )}
              <button onClick={() => dismiss(n.id)} title="Dismiss" className="rounded p-1 text-muted hover:text-danger">
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
