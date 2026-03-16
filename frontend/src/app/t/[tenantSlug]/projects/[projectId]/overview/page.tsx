import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getProjectOverviewData } from "@/lib/api/client";

export default async function ProjectOverviewPage({
  params
}: {
  params: Promise<{ tenantSlug: string; projectId: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug, projectId } = await params;
  const data = await getProjectOverviewData(tenantSlug, projectId);

  return (
    <div className="space-y-6 px-8 py-8">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Overview</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Study status</h2>
            </div>
            <Badge variant="active">{data.project.status}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              ["Protocol", `${data.protocolCount} protocol versions`],
              ["Cohort", `${data.cohorts.length} cohorts`],
              ["Dataset", `${data.datasetCount} datasets`],
              ["Analysis", `${data.auditLogs.length} audit records`],
              ["Manuscript", `${data.manuscriptCount} manuscripts`],
              ["Governance", `${data.approvals.length} approvals`]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-surface-subtle p-4">
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Lineage summary</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Research chain</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...data.cohorts.map((item) => `${item.name} -> ${item.status}`), ...data.approvals.map((item) => `${item.targetType} -> ${item.status}`)].map((item) => (
              <div key={item} className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm text-muted">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
