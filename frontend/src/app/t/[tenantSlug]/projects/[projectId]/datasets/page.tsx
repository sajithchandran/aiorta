import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDatasetsPageData } from "@/lib/api/client";

export default async function DatasetsPage({
  params
}: {
  params: Promise<{ tenantSlug: string; projectId: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug, projectId } = await params;
  const data = await getDatasetsPageData(tenantSlug, projectId);

  return (
    <div className="space-y-6 px-8 py-8">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Dataset preview</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{data.primaryDataset?.name ?? "No dataset available"}</h2>
            </div>
            <Badge variant="success">{data.primaryDataset?.status ?? "Unavailable"}</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-3xl border border-line/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-subtle text-muted">
                  <tr>
                    {["version", "rows", "columns", "status", "cohort_id", "data_source_id"].map((column) => (
                      <th key={column} className="px-4 py-3 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data.versions.slice(0, 3).map((version, row) => (
                    <tr key={row} className="border-t border-line/60">
                      {[
                        `v${String((version as { versionNumber?: number }).versionNumber ?? row + 1)}`,
                        String((version as { rowCount?: number }).rowCount ?? 0),
                        String((version as { columnCount?: number }).columnCount ?? 0),
                        String((version as { status?: string }).status ?? "UNKNOWN"),
                        String((version as { cohortId?: string | null }).cohortId ?? "-"),
                        String((version as { dataSourceId?: string | null }).dataSourceId ?? "-")
                      ].map((value, index) => (
                        <td key={`${row}-${index}`} className="px-4 py-3 text-muted">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Version history</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Dataset timeline</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.lineage.versions.map((version) => (
                <div key={String(version.id)} className="rounded-2xl bg-surface-subtle px-4 py-4">
                  <div className="font-medium text-foreground">v{String(version.versionNumber)}</div>
                  <div className="mt-1 text-sm text-muted">{String(version.status)}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Dataset summary</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Live metadata</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Datasets", `${data.datasets.length} records`],
                ["Versions", `${data.lineage.versionCount} versions`],
                ["Primary dataset", data.primaryDataset?.name ?? "Unavailable"]
              ].map(([label, stat]) => (
                <div key={label} className="rounded-2xl bg-surface-subtle px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <span className="text-sm text-muted">{stat}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
