import { cn } from "@/lib/utils";

export function FormField({
  label,
  hint,
  children,
  className
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <label className={cn("block space-y-2", className)}>
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {hint ? <div className="mt-1 text-xs leading-5 text-muted">{hint}</div> : null}
      </div>
      {children}
    </label>
  );
}
