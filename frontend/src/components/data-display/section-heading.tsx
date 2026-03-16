export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}): React.JSX.Element {
  return (
    <div>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
      ) : null}
      <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-foreground">{title}</h1>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p> : null}
    </div>
  );
}
