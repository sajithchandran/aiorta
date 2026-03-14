import Link from "next/link";
import { FlaskConical, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage(): React.JSX.Element {
  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--accent-yellow)/0.32),transparent_24%),radial-gradient(circle_at_top,hsl(var(--accent-orange)/0.18),transparent_34%),radial-gradient(circle_at_right,hsl(var(--accent-red)/0.14),transparent_30%),hsl(var(--canvas))] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex items-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--accent-yellow)),hsl(var(--accent-orange))_58%,hsl(var(--accent-red)))] text-white shadow-soft">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.02em] text-foreground">AIORTA</div>
              <div className="text-xs text-muted">Clinical research platform</div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Secure login</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              Sign in to your research workspace
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              Access tenant-scoped projects, cohorts, datasets, statistical outputs, and manuscript workspaces.
            </p>
          </div>

          <Card className="p-6">
            <LoginForm />
          </Card>

          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>Local dev account seeded in backend.</span>
            <Link href="/">
              <Button variant="ghost" className="px-0">
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden items-center px-12 py-12 lg:flex">
        <div className="mx-auto w-full max-w-xl space-y-6">
          <Card className="p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Tenant-aware access control</p>
                <p className="text-sm text-muted">JWT authentication, membership checks, and audit-aware backend APIs.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Evidence-grounded research workflow</p>
                <p className="text-sm text-muted">Projects, cohorts, datasets, analysis runs, and manuscript drafts in one workspace.</p>
              </div>
            </div>
          </Card>

          <div className="rounded-[2rem] bg-white/75 p-8 shadow-panel ring-1 ring-line/70 backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Developer access</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="rounded-2xl bg-surface-subtle px-4 py-3">
                Email: <span className="font-medium text-foreground">dev@aiorta.dev</span>
              </div>
              <div className="rounded-2xl bg-surface-subtle px-4 py-3">
                Password: <span className="font-medium text-foreground">DevPassword123!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
