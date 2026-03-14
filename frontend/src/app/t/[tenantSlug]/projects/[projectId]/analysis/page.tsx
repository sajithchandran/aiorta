import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAnalysisPageData } from "@/lib/api/client";

export default async function AnalysisPage({
  params
}: {
  params: Promise<{ tenantSlug: string; projectId: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug, projectId } = await params;
  const data = await getAnalysisPageData(tenantSlug, projectId);

  return (
    <div className="space-y-6 px-8 py-8">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Analysis setup</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Run configuration</h2>
            </div>
            <Button>Start analysis</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              data.primaryRun?.statisticalPlan?.name ?? "No statistical plan attached",
              `Dataset version ${data.primaryRun?.datasetVersion?.versionNumber ?? "-"}`,
              `Run status: ${data.primaryRun?.status ?? "Unavailable"}`,
              `${data.artifacts.resultCount} analysis result groups`
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm text-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Results</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Table 1 and figures</h2>
            </div>
            <Badge variant="success">{data.primaryRun?.status ?? "No run"}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-surface-subtle p-4">
              <div className="text-sm text-muted">Result tables</div>
              <div className="mt-4 h-48 rounded-2xl bg-white shadow-soft" />
              <div className="mt-4 text-sm text-muted">{data.artifacts.tableCount} backend tables</div>
            </div>
            <div className="rounded-3xl bg-surface-subtle p-4">
              <div className="text-sm text-muted">Result figures</div>
              <div className="mt-4 h-48 rounded-2xl bg-white shadow-soft" />
              <div className="mt-4 text-sm text-muted">{data.artifacts.figureCount} backend figures</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
