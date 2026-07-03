"use client";

import { BookOpenText, LayoutList } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { DocsLink } from "@/lib/types";

export function DocsPanel({ docs }: { docs: DocsLink[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <BookOpenText className="size-4 text-accent2" />
          Documentation
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        {docs.map((doc) => (
        <a key={doc.title} href={doc.href} className="block rounded-md border border-line bg-[#10192e] p-3 hover:border-accent/40">
            <div className="flex items-center gap-2">
              <LayoutList className="size-4 text-warning" />
              <div className="text-sm font-medium">{doc.title}</div>
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{doc.kind}</div>
          </a>
        ))}
      </CardBody>
    </Card>
  );
}
