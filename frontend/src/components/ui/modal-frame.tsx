import { Button } from "./button";

export function ModalFrame({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-[28px] bg-surface p-8 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{title}</h2>
          {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        <Button variant="ghost">Close</Button>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
