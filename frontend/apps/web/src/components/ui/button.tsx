import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-line bg-panelSoft px-3 py-2 text-sm font-medium text-text transition hover:border-accent/60 hover:bg-[#1b2847] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
}
