import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "glass-card rounded-xl border border-line/40 bg-panel/40 backdrop-blur-md shadow-panel transition-all duration-300 hover:border-accent/30",
        className
      )}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "border-b border-line/30 px-5 py-4 flex items-center justify-between bg-white/[0.01]",
        className
      )}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-5 text-sm leading-relaxed text-text/90", className)} />;
}
