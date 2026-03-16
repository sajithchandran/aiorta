import { Inbox } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-surface-subtle px-8 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft">
        <Inbox className="h-6 w-6 text-muted" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {actionLabel ? <Button className="mt-6">{actionLabel}</Button> : null}
    </div>
  );
}
