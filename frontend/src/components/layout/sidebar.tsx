"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, FlaskConical } from "lucide-react";
import { buildPrimaryNav } from "./navigation";
import { cn } from "@/lib/utils";

export function Sidebar({
  tenantName,
  tenantSlug,
  projectSlug,
  projectCount,
  collapsed
}: {
  tenantName: string;
  tenantSlug: string;
  projectSlug?: string;
  projectCount: number;
  collapsed: boolean;
}): React.JSX.Element {
  const pathname = usePathname();
  const primaryNav = buildPrimaryNav(tenantSlug, projectSlug);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-line/70 bg-white/85 py-5 backdrop-blur-xl transition-[padding,width] duration-200",
        collapsed ? "px-3" : "px-4"
      )}
    >
      <div className={cn("rounded-2xl py-2", collapsed ? "px-0" : "px-3")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--accent-yellow)),hsl(var(--accent-orange))_56%,hsl(var(--accent-red)))] text-white shadow-soft">
          <FlaskConical className="h-5 w-5" />
        </div>
        {!collapsed ? (
          <div>
            <div className="text-sm font-semibold tracking-[0.02em] text-foreground">AIORTA</div>
            <div className="text-xs text-muted">Clinical research platform</div>
          </div>
        ) : null}
        </div>
      </div>

      <button
        className={cn(
          "mt-5 flex rounded-2xl bg-surface-subtle text-left",
          collapsed ? "justify-center px-0 py-3" : "items-center justify-between px-4 py-3"
        )}
        aria-label={tenantName}
      >
        {collapsed ? (
          <div className="text-sm font-semibold text-foreground">
            {tenantName.slice(0, 1).toUpperCase()}
          </div>
        ) : (
          <>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Tenant</div>
              <div className="mt-1 text-sm font-medium text-foreground">{tenantName}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted" />
          </>
        )}
      </button>

      <nav className="mt-6 space-y-1">
        {primaryNav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex rounded-2xl text-sm transition",
                collapsed ? "justify-center px-0 py-2.5" : "items-center gap-3 px-3 py-2.5",
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-surface-subtle hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-auto rounded-3xl bg-surface-subtle", collapsed ? "p-3" : "p-4")}>
        {collapsed ? (
          <div className="text-center">
            <div className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{projectCount}</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">Projects</div>
          </div>
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Workspace summary</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{projectCount}</span>
              <span className="text-xs text-muted">projects loaded</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Navigation is generated from the active tenant context and live project records from the backend.
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
