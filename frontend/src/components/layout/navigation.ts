import {
  Activity,
  Database,
  FilePenLine,
  FolderKanban,
  LayoutDashboard,
  Shield,
  Users
} from "lucide-react";

export function buildPrimaryNav(tenantSlug: string, projectSlug?: string) {
  const projectBase = projectSlug ? `/t/${tenantSlug}/projects/${projectSlug}` : `/t/${tenantSlug}/projects`;

  return [
    { label: "Dashboard", href: `/t/${tenantSlug}/dashboard`, icon: LayoutDashboard },
    { label: "Projects", href: `/t/${tenantSlug}/projects`, icon: FolderKanban },
    { label: "Datasets", href: projectSlug ? `${projectBase}/datasets` : `/t/${tenantSlug}/projects`, icon: Database },
    { label: "Cohorts", href: projectSlug ? `${projectBase}/cohorts` : `/t/${tenantSlug}/projects`, icon: Activity },
    { label: "Analytics", href: projectSlug ? `${projectBase}/analysis` : `/t/${tenantSlug}/projects`, icon: Activity },
    { label: "Manuscripts", href: projectSlug ? `${projectBase}/manuscripts` : `/t/${tenantSlug}/projects`, icon: FilePenLine },
    { label: "Team", href: `/t/${tenantSlug}/admin`, icon: Users },
    { label: "Admin", href: `/t/${tenantSlug}/admin`, icon: Shield }
  ] as const;
}

export const workspaceTabs = [
  { label: "Overview", slug: "overview" },
  { label: "Protocol", slug: "protocol" },
  { label: "Cohorts", slug: "cohorts" },
  { label: "Datasets", slug: "datasets" },
  { label: "Analysis", slug: "analysis" },
  { label: "Manuscripts", slug: "manuscripts" },
  { label: "Governance", slug: "governance" }
] as const;
