import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,hsl(var(--accent-yellow)/0.35),transparent_28%),radial-gradient(circle_at_top,hsl(var(--accent-orange)/0.2),transparent_36%),radial-gradient(circle_at_right,hsl(var(--accent-red)/0.14),transparent_32%),hsl(var(--canvas))] px-6">
      <div className="max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          AI clinical research platform
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-foreground">
          Calm, rigorous software for modern clinical research teams.
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Projects, cohorts, datasets, analysis, and manuscript generation in one precise workspace.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
