"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({
  children,
  tenantName,
  tenantSlug,
  projectSlug,
  projectCount,
  userFullName,
  userEmail
}: {
  children: React.ReactNode;
  tenantName: string;
  tenantSlug: string;
  projectSlug?: string;
  projectCount: number;
  userFullName: string;
  userEmail: string;
}): React.JSX.Element {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="grid min-h-screen bg-[hsl(var(--canvas))] text-foreground transition-[grid-template-columns] duration-200"
      style={{
        gridTemplateColumns: sidebarCollapsed ? "88px 1fr" : "272px 1fr"
      }}
    >
      <Sidebar
        tenantName={tenantName}
        tenantSlug={tenantSlug}
        projectSlug={projectSlug}
        projectCount={projectCount}
        collapsed={sidebarCollapsed}
      />
      <div className="min-w-0">
        <Topbar
          userFullName={userFullName}
          userEmail={userEmail}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
