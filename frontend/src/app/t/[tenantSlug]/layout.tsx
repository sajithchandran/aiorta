import { AppShell } from "@/components/layout/app-shell";
import { getTenantShellData } from "@/lib/api/client";
import { getSessionAccessToken } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function TenantLayout({
  params,
  children
}: {
  params: Promise<{ tenantSlug: string }>;
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const sessionToken = await getSessionAccessToken();

  if (!sessionToken) {
    redirect("/login");
  }

  const { tenantSlug } = await params;
  const shellData = await getTenantShellData(tenantSlug);

  return (
    <AppShell
      tenantName={shellData.tenant.name}
      tenantSlug={shellData.tenant.slug}
      projectSlug={shellData.primaryProject?.slug}
      projectCount={shellData.projects.length}
      userFullName={shellData.currentUser.fullName}
      userEmail={shellData.currentUser.email}
    >
      {children}
    </AppShell>
  );
}
