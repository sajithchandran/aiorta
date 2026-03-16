import { cn } from "@/lib/utils";

export function TableShell({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-line/70 bg-surface", className)}>
      {children}
    </div>
  );
}
