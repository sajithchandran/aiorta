import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { clearSessionAccessToken, getSessionAccessToken } from "@/lib/auth/session";

const DEFAULT_API_BASE_URL = "http://localhost:4000";
const API_PREFIX = "/api/v1";

function normalizeApiBaseUrl(rawBaseUrl: string): string {
  const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

  if (trimmedBaseUrl.endsWith(API_PREFIX)) {
    return trimmedBaseUrl;
  }

  return `${trimmedBaseUrl}${API_PREFIX}`;
}

const API_BASE_URL = normalizeApiBaseUrl(
  process.env.AIORTA_API_BASE_URL ?? DEFAULT_API_BASE_URL
);

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
};

export type TenantRecord = {
  id: string;
  slug: string;
  name: string;
  type: "INDIVIDUAL" | "TEAM" | "ORGANIZATION";
};

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  code?: string | null;
  description?: string | null;
  status: string;
  updatedAt: string;
};

export type CurrentUserRecord = {
  id: string;
  email: string;
  fullName: string;
};

const getAccessToken = cache(async (): Promise<string> => {
  const sessionToken = await getSessionAccessToken();

  if (sessionToken) {
    return sessionToken;
  }

  redirect("/login");
});

async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  if (response.status === 401) {
    await clearSessionAccessToken();
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`API request to ${path} failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function listTenants(): Promise<TenantRecord[]> {
  return apiFetch<TenantRecord[]>("/tenants");
}

export async function getCurrentUser(): Promise<CurrentUserRecord> {
  return apiFetch<CurrentUserRecord>("/users/me");
}

export async function resolveTenant(tenantSlug: string): Promise<TenantRecord> {
  const tenants = await listTenants();
  const tenant = tenants.find((item) => item.slug === tenantSlug);

  if (!tenant) {
    throw new Error(`Tenant ${tenantSlug} was not found.`);
  }

  return tenant;
}

export async function listProjects(tenantId: string): Promise<ProjectRecord[]> {
  const response = await apiFetch<{
    success: true;
    items: ProjectRecord[];
  }>(`/tenants/${tenantId}/projects`);

  return response.items;
}

export async function resolveProject(
  tenantId: string,
  projectSlugOrId: string
): Promise<ProjectRecord> {
  const projects = await listProjects(tenantId);
  const project = projects.find(
    (item) => item.id === projectSlugOrId || item.slug === projectSlugOrId
  );

  if (!project) {
    throw new Error(`Project ${projectSlugOrId} was not found.`);
  }

  return project;
}

export async function getDashboardData(tenantSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const projects = await listProjects(tenant.id);
  const primaryProject = projects[0] ?? null;

  const [currentUser, users, accessLogs, datasets, analysisRuns, manuscripts] = await Promise.all([
    getCurrentUser(),
    apiFetch<{ success: true; items: Array<{ id: string }> }>(`/tenants/${tenant.id}/users`),
    apiFetch<{ success: true; items: Array<{ action: string; metadataJson?: { path?: string | null } }> }>(
      `/tenants/${tenant.id}/access-logs`
    ),
    primaryProject
      ? apiFetch<{ success: true; items: Array<{ id: string; status: string }> }>(
          `/tenants/${tenant.id}/projects/${primaryProject.id}/datasets`
        )
      : Promise.resolve({ success: true as const, items: [] as Array<{ id: string; status: string }> }),
    primaryProject
      ? apiFetch<{ success: true; items: Array<{ id: string; status: string }> }>(
          `/tenants/${tenant.id}/projects/${primaryProject.id}/analysis-runs`
        )
      : Promise.resolve({ success: true as const, items: [] as Array<{ id: string; status: string }> }),
    primaryProject
      ? apiFetch<Array<{ id: string; status: string }>>(
          `/tenants/${tenant.id}/projects/${primaryProject.id}/manuscripts`
        )
      : Promise.resolve([] as Array<{ id: string; status: string }>)
  ]);

  return {
    currentUser,
    tenant,
    projects,
    primaryProject,
    userCount: users.items.length,
    activity: accessLogs.items.slice(0, 4),
    datasetCount: datasets.items.length,
    analysisRunCount: analysisRuns.items.length,
    manuscriptCount: manuscripts.length
  };
}

export async function getProjectsPageData(tenantSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const [projects, users] = await Promise.all([
    listProjects(tenant.id),
    apiFetch<{ success: true; items: Array<{ id: string }> }>(`/tenants/${tenant.id}/users`)
  ]);

  return {
    tenant,
    projects,
    memberCount: users.items.length
  };
}

export async function getProjectOverviewData(tenantSlug: string, projectSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const project = await resolveProject(tenant.id, projectSlug);
  const [cohorts, approvals, auditLogs, protocols, datasets, manuscripts] = await Promise.all([
    apiFetch<{ success: true; items: Array<{ id: string; name: string; status: string }> }>(
      `/tenants/${tenant.id}/projects/${project.id}/cohorts`
    ),
    apiFetch<{ success: true; items: Array<{ id: string; targetType: string; status: string }> }>(
      `/tenants/${tenant.id}/projects/${project.id}/approvals`
    ),
    apiFetch<{ success: true; items: Array<{ action: string; occurredAt: string }> }>(
      `/tenants/${tenant.id}/projects/${project.id}/audit-logs`
    ),
    apiFetch<{ success: true; items: Array<{ id: string }> }>(
      `/tenants/${tenant.id}/projects/${project.id}/protocols`
    ),
    apiFetch<{ success: true; items: Array<{ id: string }> }>(
      `/tenants/${tenant.id}/projects/${project.id}/datasets`
    ),
    apiFetch<Array<{ id: string }>>(
      `/tenants/${tenant.id}/projects/${project.id}/manuscripts`
    )
  ]);

  return {
    tenant,
    project,
    cohorts: cohorts.items,
    approvals: approvals.items,
    auditLogs: auditLogs.items,
    protocolCount: protocols.items.length,
    datasetCount: datasets.items.length,
    manuscriptCount: manuscripts.length
  };
}

export async function getProtocolsPageData(tenantSlug: string, projectSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const project = await resolveProject(tenant.id, projectSlug);
  const protocols = await apiFetch<{ success: true; items: Array<{ id: string; title: string; version: number; status: string }> }>(
    `/tenants/${tenant.id}/projects/${project.id}/protocols`
  );

  return { tenant, project, protocols: protocols.items };
}

export async function getCohortsPageData(tenantSlug: string, projectSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const project = await resolveProject(tenant.id, projectSlug);
  const cohorts = await apiFetch<{
    success: true;
    items: Array<{ id: string; name: string; status: string; _count?: { rules: number } }>;
  }>(`/tenants/${tenant.id}/projects/${project.id}/cohorts`);

  const preview =
    cohorts.items[0] != null
      ? await apiFetch<{
          cohortId: string;
          name: string;
          status: string;
          subjectCount?: number | null;
          ruleCount: number;
          rules: Array<{
            id: string;
            fieldLabel?: string | null;
            fieldKey?: string | null;
            operator?: string | null;
            logicalOperator?: string | null;
            valueJson?: Record<string, unknown> | null;
          }>;
        }>(`/tenants/${tenant.id}/projects/${project.id}/cohorts/${cohorts.items[0].id}/preview`)
      : null;

  return { tenant, project, cohorts: cohorts.items, preview };
}

export async function getDatasetsPageData(tenantSlug: string, projectSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const project = await resolveProject(tenant.id, projectSlug);
  const datasets = await apiFetch<{
    success: true;
    items: Array<{ id: string; name: string; status: string; description?: string | null }>;
  }>(`/tenants/${tenant.id}/projects/${project.id}/datasets`);

  const primaryDataset = datasets.items[0] ?? null;
  const [versions, lineage] = primaryDataset
    ? await Promise.all([
        apiFetch<{ success: true; items: Array<Record<string, unknown>> }>(
          `/tenants/${tenant.id}/projects/${project.id}/datasets/${primaryDataset.id}/versions`
        ),
        apiFetch<{ versionCount: number; versions: Array<Record<string, unknown>> }>(
          `/tenants/${tenant.id}/projects/${project.id}/datasets/${primaryDataset.id}/lineage`
        )
      ])
    : [{ success: true as const, items: [] }, { versionCount: 0, versions: [] }];

  return { tenant, project, datasets: datasets.items, primaryDataset, versions: versions.items, lineage };
}

export async function getGovernancePageData(tenantSlug: string, projectSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const project = await resolveProject(tenant.id, projectSlug);
  const [approvals, irbSubmissions] = await Promise.all([
    apiFetch<{ success: true; items: Array<{ id: string; targetType: string; status: string }> }>(
      `/tenants/${tenant.id}/projects/${project.id}/approvals`
    ),
    apiFetch<{ success: true; items: Array<{ id: string; referenceNumber?: string | null; status: string }> }>(
      `/tenants/${tenant.id}/projects/${project.id}/irb-submissions`
    )
  ]);

  const signatures =
    approvals.items[0] != null
      ? await apiFetch<{ success: true; items: Array<{ id: string; signerId: string; status: string }> }>(
          `/tenants/${tenant.id}/projects/${project.id}/approvals/${approvals.items[0].id}/signatures`
        )
      : { success: true as const, items: [] as Array<{ id: string; signerId: string; status: string }> };

  return { tenant, project, approvals: approvals.items, irbSubmissions: irbSubmissions.items, signatures: signatures.items };
}

export async function getAdminPageData(tenantSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const [currentUser, users, accessLogs] = await Promise.all([
    getCurrentUser(),
    apiFetch<{ success: true; items: Array<{ id: string; fullName: string; email: string; memberships: Array<{ role?: { name?: string | null } | null }> }> }>(
      `/tenants/${tenant.id}/users`
    ),
    apiFetch<{ success: true; items: Array<{ action: string }> }>(`/tenants/${tenant.id}/access-logs`)
  ]);

  return { tenant, currentUser, users: users.items, usageCount: accessLogs.items.length };
}

export async function getAnalysisPageData(tenantSlug: string, projectSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const project = await resolveProject(tenant.id, projectSlug);
  const runs = await apiFetch<{
    success: true;
    items: Array<{ id: string; status: string; datasetVersion: { versionNumber: number }; statisticalPlan?: { name?: string | null } | null }>;
  }>(`/tenants/${tenant.id}/projects/${project.id}/analysis-runs`);

  const primaryRun = runs.items[0] ?? null;
  const artifacts =
    primaryRun != null
      ? await apiFetch<{
          resultCount: number;
          tableCount: number;
          figureCount: number;
          results: Array<{ title: string; resultTables: Array<unknown>; resultFigures: Array<unknown> }>;
        }>(`/tenants/${tenant.id}/projects/${project.id}/analysis-runs/${primaryRun.id}/artifacts`)
      : { resultCount: 0, tableCount: 0, figureCount: 0, results: [] };

  return { tenant, project, runs: runs.items, primaryRun, artifacts };
}

export async function getManuscriptsPageData(tenantSlug: string, projectSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const project = await resolveProject(tenant.id, projectSlug);
  const manuscripts = await apiFetch<Array<{ id: string; title: string; status: string }>>(
    `/tenants/${tenant.id}/projects/${project.id}/manuscripts`
  );

  const primaryManuscript = manuscripts[0] ?? null;
  const versions =
    primaryManuscript != null
      ? await apiFetch<
          Array<{
            id: string;
            versionNumber: number;
            status: string;
            sections: Array<{ id: string; sectionType: string; title?: string | null; content?: string | null }>;
          }>
        >(`/tenants/${tenant.id}/projects/${project.id}/manuscripts/${primaryManuscript.id}/versions`)
      : [];

  return { tenant, project, manuscripts, primaryManuscript, versions };
}

export async function getTenantShellData(tenantSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const [currentUser, projects] = await Promise.all([getCurrentUser(), listProjects(tenant.id)]);

  return {
    tenant,
    currentUser,
    projects,
    primaryProject: projects[0] ?? null
  };
}

export async function getProjectHeaderData(tenantSlug: string, projectSlug: string) {
  const tenant = await resolveTenant(tenantSlug);
  const project = await resolveProject(tenant.id, projectSlug);

  return {
    tenant,
    project
  };
}
