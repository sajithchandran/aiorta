"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { workspaceTabs } from "./navigation";
import { cn } from "@/lib/utils";

export function WorkspaceTabs({
  tenantSlug,
  projectId
}: {
  tenantSlug: string;
  projectId: string;
}): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="border-b border-line/70 px-8">
      <div className="flex gap-2 overflow-x-auto py-3">
        {workspaceTabs.map((tab) => {
          const href = `/t/${tenantSlug}/projects/${projectId}/${tab.slug}`;
          const active = pathname === href;

          return (
            <Link
              key={tab.slug}
              href={href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-white text-foreground shadow-soft"
                  : "text-muted hover:bg-white/80 hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
