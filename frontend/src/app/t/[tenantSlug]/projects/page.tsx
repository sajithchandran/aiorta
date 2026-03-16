import { SlidersHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/data-display/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { getProjectsPageData } from "@/lib/api/client";

export default async function ProjectsPage({
  params
}: {
  params: Promise<{ tenantSlug: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug } = await params;
  const data = await getProjectsPageData(tenantSlug);

  return (
    <div className="space-y-8 px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading
          eyebrow="Projects"
          title={`${data.tenant.name} projects`}
          description="Project records are now loaded from the backend API and scoped to the active tenant."
        />
        <Button>New project</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex w-full flex-wrap items-center gap-3">
            <div className="min-w-[240px] flex-1">
              <Input placeholder="Search by title, code, or investigator..." />
            </div>
            <Button variant="secondary">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-3xl border border-line/70">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-surface-subtle text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Project</th>
                  <th className="px-5 py-4 font-medium">Code</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Last updated</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.projects.map((project) => (
                  <tr key={project.id} className="border-t border-line/60 hover:bg-surface-subtle/70">
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{project.title}</div>
                    </td>
                    <td className="px-5 py-4 text-muted">{project.code ?? project.slug}</td>
                    <td className="px-5 py-4">
                      <Badge variant={project.status === "ACTIVE" ? "active" : "neutral"}>{project.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-muted">{new Date(project.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmptyState
          title="No archived studies yet"
          description="Archived projects will stay visible here for auditability and historical manuscript access."
          actionLabel="Archive a project"
        />
        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Portfolio notes</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Current workload</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted">
            <p>{data.projects.length} projects currently resolve from the backend.</p>
            <p>{data.memberCount} tenant users are available for role and collaboration screens.</p>
            <p>Filter density remains intentionally light to reduce cognitive noise.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
