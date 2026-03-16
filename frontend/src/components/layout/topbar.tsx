import { Bell, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar({
  userFullName,
  userEmail,
  sidebarCollapsed,
  onToggleSidebar
}: {
  userFullName: string;
  userEmail: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}): React.JSX.Element {
  const initials = userFullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-line/60 bg-[hsl(var(--canvas)/0.82)] px-8 py-5 backdrop-blur-xl">
      <div className="flex w-full max-w-xl items-center gap-3">
        <Button
          variant="ghost"
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="h-10 w-10 rounded-2xl px-0"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="pl-10" placeholder="Search projects, variables, analyses, manuscripts..." />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-muted shadow-soft">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-soft">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
            {initials || "AU"}
          </div>
          <div className="pr-2">
            <div className="text-sm font-medium text-foreground">{userFullName}</div>
            <div className="text-xs text-muted">{userEmail}</div>
          </div>
        </div>
        <form action={logoutAction}>
          <Button variant="ghost" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
