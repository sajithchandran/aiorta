import { FilePenLine, FolderKanban, Microscope, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/data-display/section-heading";
import { MetricCard } from "@/components/metrics/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDashboardData } from "@/lib/api/client";

export default async function DashboardPage({
  params
}: {
  params: Promise<{ tenantSlug: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug } = await params;
  const data = await getDashboardData(tenantSlug);
  const recentProjects = data.projects.slice(0, 3);
  const timeline = data.activity.map((item) => item.metadataJson?.path ?? item.action);

  return (
    <div className="space-y-8 px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading
          eyebrow="Workspace"
          title={data.tenant.name}
          description="Live tenant projects, access events, and downstream research activity loaded from the backend API."
        />
        <Button>New project</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active projects" value={String(data.projects.length)} meta={`${data.userCount} tenant users`} />
        <MetricCard label="Datasets" value={String(data.datasetCount)} meta="Loaded from project dataset records" />
        <MetricCard label="Analysis runs" value={String(data.analysisRunCount)} meta="Loaded from backend analysis runs" />
        <MetricCard label="Manuscripts" value={String(data.manuscriptCount)} meta="Loaded from manuscript records" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Recent projects</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Research portfolio</h2>
            </div>
            <Button variant="secondary">Open all projects</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between rounded-2xl bg-surface-subtle px-4 py-4">
                <div>
                  <div className="font-medium text-foreground">{project.title}</div>
                  <div className="mt-1 text-sm text-muted">{project.code ?? project.slug}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={project.status === "ACTIVE" ? "active" : "neutral"}>{project.status}</Badge>
                  <span className="text-sm text-muted">{new Date(project.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Live operations</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Research pipeline</h2>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: FolderKanban, label: "Projects", value: `${data.projects.length} loaded` },
                { icon: Microscope, label: "Analysis jobs", value: `${data.analysisRunCount} runs` },
                { icon: Sparkles, label: "Access activity", value: `${timeline.length} recent events` },
                { icon: FilePenLine, label: "Manuscripts", value: `${data.manuscriptCount} records` }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-2xl bg-surface-subtle p-4">
                    <Icon className="h-4 w-4 text-accent" />
                    <div className="mt-3 text-sm text-muted">{item.label}</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">{item.value}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Activity</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Recent events</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeline.map((item, index) => (
                <div key={`${item}-${index}`} className="flex gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-muted">{item ?? "Recent API interaction"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
