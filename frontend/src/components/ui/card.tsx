import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div className={cn("rounded-3xl bg-surface shadow-panel", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("flex items-start justify-between gap-4 p-6", className)}>{children}</div>;
}

export function CardContent({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}
