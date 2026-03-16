import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getProtocolsPageData } from "@/lib/api/client";

export default async function ProtocolPage({
  params
}: {
  params: Promise<{ tenantSlug: string; projectId: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug, projectId } = await params;
  const data = await getProtocolsPageData(tenantSlug, projectId);

  return (
    <div className="space-y-6 px-8 py-8">
      <Card>
        <CardHeader>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Protocol</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Study protocol management</h2>
          </div>
          <Button>Upload new version</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.protocols.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-surface-subtle px-4 py-4">
              <div>
                <div className="font-medium text-foreground">{item.title}</div>
                <div className="text-sm text-muted">Version {item.version} · {item.status}</div>
              </div>
              <Button variant="secondary">Open</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
