import { Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCohortsPageData } from "@/lib/api/client";

function RuleChip({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="rounded-xl bg-white px-3 py-2 text-sm text-foreground shadow-soft ring-1 ring-line">
      {children}
    </div>
  );
}

export default async function CohortsPage({
  params
}: {
  params: Promise<{ tenantSlug: string; projectId: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug, projectId } = await params;
  const data = await getCohortsPageData(tenantSlug, projectId);
  const variableSuggestions = Array.from(
    new Set(
      (data.preview?.rules ?? [])
        .flatMap((rule) => [rule.fieldLabel, rule.fieldKey])
        .filter((item): item is string => Boolean(item))
    )
  );
  const previewRules = data.preview?.rules ?? [];

  return (
    <div className="grid gap-6 px-8 py-8 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
      <Card className="h-fit">
        <CardHeader>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Variable palette</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Suggestions</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {variableSuggestions.length > 0 ? (
            variableSuggestions.map((item) => (
              <div key={item} className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm text-foreground">
                {item}
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm text-muted">
              Variable suggestions will appear once cohort rule metadata is available from the backend.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Cohort builder</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Eligibility logic</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Add OR group
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add rule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl bg-surface-subtle p-4">
            <div className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground shadow-soft">
              AND
            </div>
            <div className="space-y-3">
              {previewRules.map((rule) => (
                <RuleChip key={rule.id}>
                  {rule.fieldLabel ?? rule.fieldKey ?? "Rule"} {rule.operator ?? ""}{" "}
                  {typeof rule.valueJson?.value === "string" || typeof rule.valueJson?.value === "number"
                    ? String(rule.valueJson.value)
                    : ""}
                </RuleChip>
              ))}
              {previewRules.length === 0 ? (
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-muted shadow-soft ring-1 ring-line">
                  No cohort preview rules are available yet.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 ring-1 ring-line">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              Logic explanation
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              {data.preview
                ? `${data.preview.name} currently has ${data.preview.ruleCount} rules sourced from the backend preview endpoint.`
                : "No preview cohort is available yet."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Preview</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Live patient count</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl bg-accent-soft p-5">
              <div className="text-sm text-muted">Matching patients</div>
              <div className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-foreground">
                {data.preview?.subjectCount ?? 0}
              </div>
              <div className="mt-2 text-sm text-muted">{data.preview?.status ?? "No preview available"}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="warning">{data.cohorts.length} cohorts loaded</Badge>
              <Badge variant="neutral">{data.preview?.ruleCount ?? 0} rules</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Warnings</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Validation notes</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
              {[
                "Backend preview data is connected.",
                `${data.cohorts.length} saved cohorts are available in this project.`,
                `${previewRules.length} preview rules are currently materialized.`
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm leading-6 text-muted">
                  {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
