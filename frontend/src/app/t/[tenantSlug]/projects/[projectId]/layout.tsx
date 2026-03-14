import { WorkspaceTabs } from "@/components/layout/workspace-tabs";
import { getProjectHeaderData } from "@/lib/api/client";

export default async function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string; projectId: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug, projectId } = await params;
  const data = await getProjectHeaderData(tenantSlug, projectId);

  return (
    <div>
      <div className="px-8 pb-5 pt-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {data.tenant.slug} / {data.project.slug}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">
          {data.project.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          {data.project.description ?? "A project workspace for cohort design, analysis governance, and evidence-grounded writing."}
        </p>
      </div>
      <WorkspaceTabs tenantSlug={tenantSlug} projectId={projectId} />
      <div>{children}</div>
    </div>
  );
}
