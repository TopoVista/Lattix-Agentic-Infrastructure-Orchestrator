"use client";

import { BellRing, AlertTriangle, Info } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { NotificationItem } from "@/lib/types";

export function NotificationsPanel({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <BellRing className="size-4 text-warning" />
          Notifications
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        {notifications.map((item) => (
          <div key={item.id} className="rounded-md border border-line bg-[#10192e] p-3">
            <div className="flex items-start gap-2">
              {item.severity === "critical" ? <AlertTriangle className="size-4 text-danger" /> : <Info className="size-4 text-accent" />}
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="mt-1 text-sm text-muted">{item.body}</div>
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
