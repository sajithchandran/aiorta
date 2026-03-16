import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getGovernancePageData } from "@/lib/api/client";

export default async function GovernancePage({
  params
}: {
  params: Promise<{ tenantSlug: string; projectId: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug, projectId } = await params;
  const data = await getGovernancePageData(tenantSlug, projectId);

  return (
    <div className="grid gap-6 px-8 py-8 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Approvals</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Current approval checkpoints</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.approvals.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-surface-subtle px-4 py-4">
              <div className="font-medium text-foreground">{item.targetType}</div>
              <Badge variant={item.status === "APPROVED" ? "success" : item.status === "PENDING" ? "warning" : "neutral"}>
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Compliance</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">IRB and signatures</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            `IRB submissions: ${data.irbSubmissions.length}`,
            `Signatures loaded: ${data.signatures.length}`,
            `Approvals loaded: ${data.approvals.length}`
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm leading-6 text-muted">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
