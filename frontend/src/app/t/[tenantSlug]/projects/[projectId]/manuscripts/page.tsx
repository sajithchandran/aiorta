import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getManuscriptsPageData } from "@/lib/api/client";

export default async function ManuscriptsPage({
  params
}: {
  params: Promise<{ tenantSlug: string; projectId: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug, projectId } = await params;
  const data = await getManuscriptsPageData(tenantSlug, projectId);
  const primaryVersion = data.versions[0];
  const sectionLabels = primaryVersion?.sections.map((section) => section.sectionType) ?? [];
  const activeSection = sectionLabels[0] ?? null;

  return (
    <div className="grid gap-6 px-8 py-8 xl:grid-cols-[220px_minmax(0,1fr)_360px]">
      <Card className="h-fit p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Sections</p>
        <div className="mt-4 space-y-2">
          {sectionLabels.length > 0 ? (
            sectionLabels.map((item) => (
            <div
              key={item}
              className={`rounded-2xl px-3 py-2 text-sm ${item === activeSection ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-subtle"}`}
            >
              {item}
            </div>
            ))
          ) : (
            <div className="rounded-2xl px-3 py-2 text-sm text-muted">No sections available</div>
          )}
        </div>
        <div className="mt-6 rounded-2xl bg-surface-subtle p-4">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Version history</div>
          <div className="mt-3 space-y-2 text-sm text-muted">
            {data.versions.map((version) => (
              <div key={version.id}>
                v{version.versionNumber} {version.status}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <div className="mx-auto max-w-prose">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Manuscript editor</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {activeSection ?? data.primaryManuscript?.title ?? "Manuscript"}
              </h2>
            </div>
            <Badge variant="active">{primaryVersion?.status ?? "No version"}</Badge>
          </div>

          <div className="mt-8 space-y-5 text-[15px] leading-8 text-foreground">
            {(primaryVersion?.sections.slice(0, 3) ?? []).map((section) => (
              <p key={section.id}>{section.content ?? `${section.sectionType} section is ready for writing.`}</p>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">AI assistant</p>
              <p className="text-xs text-muted">Grounded drafting only</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-surface-subtle p-4 text-sm leading-6 text-muted">
            {data.primaryManuscript
              ? `The backend currently exposes ${data.versions.length} manuscript versions for ${data.primaryManuscript.title}.`
              : "Create a manuscript to enable evidence-grounded AI drafting."}
          </div>
          <Button className="mt-4 w-full">Generate revision</Button>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-foreground">Evidence bundle</p>
          <div className="mt-4 space-y-3">
            {[
              `Manuscripts: ${data.manuscripts.length}`,
              `Versions: ${data.versions.length}`,
              `Primary manuscript: ${data.primaryManuscript?.title ?? "Unavailable"}`,
              `Sections in current version: ${primaryVersion?.sections.length ?? 0}`
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm text-muted">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
