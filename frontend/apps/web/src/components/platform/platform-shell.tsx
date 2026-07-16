"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Brain, Layers, Activity, GitMerge, Shield, Database, 
  Cpu, BarChart3, Zap, ChevronRight 
} from "lucide-react";

const PLATFORM_TABS = [
  { href: "/platform",               label: "Overview",        icon: Layers,    exact: true },
  { href: "/platform/ai",            label: "AI Core",         icon: Brain },
  { href: "/platform/infrastructure",label: "Infrastructure",  icon: Cpu },
  { href: "/platform/observability", label: "Observability",   icon: Activity },
  { href: "/platform/digital-twin",  label: "Digital Twin",    icon: GitMerge },
  { href: "/platform/data",          label: "Data & ML",       icon: Database },
  { href: "/platform/reliability",   label: "Reliability",     icon: Zap },
  { href: "/platform/security",      label: "Security",        icon: Shield },
  { href: "/platform/enterprise",    label: "Enterprise",      icon: BarChart3 },
];

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 pb-3 text-xs text-muted">
        <span>Platform</span>
        {pathname !== "/platform" && (
          <>
            <ChevronRight className="size-3" />
            <span className="text-text capitalize">
              {PLATFORM_TABS.find(t => pathname === t.href)?.label ?? ""}
            </span>
          </>
        )}
      </div>

      {/* Tab bar */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-xl border border-line bg-[#080f1e] p-1.5">
        {PLATFORM_TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname === tab.href;
          const Icon = tab.icon;
          return (
            <a
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                active
                  ? "bg-accent text-[#060d1a] font-semibold shadow"
                  : "text-muted hover:bg-panelSoft hover:text-text"
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </a>
          );
        })}
      </div>

      {children}
    </div>
  );
}
