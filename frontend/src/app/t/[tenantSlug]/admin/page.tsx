import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminPageData } from "@/lib/api/client";

export default async function AdminPage({
  params
}: {
  params: Promise<{ tenantSlug: string }>;
}): Promise<React.JSX.Element> {
  const { tenantSlug } = await params;
  const data = await getAdminPageData(tenantSlug);
  const roleCount = new Set(
    data.users.flatMap((user) =>
      user.memberships
        .map((membership) => membership.role?.name)
        .filter((roleName): roleName is string => Boolean(roleName))
    )
  ).size;

  return (
    <div className="space-y-6 px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Tenant administration</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">People, roles, and security</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Member and security panels are now backed by the tenant user and access log APIs.
          </p>
        </div>
        <Button>Invite member</Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Members</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Research team</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Search members" />
            {data.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-2xl bg-surface-subtle px-4 py-4">
                <div>
                  <div className="font-medium text-foreground">{user.fullName}</div>
                  <div className="text-sm text-muted">{user.memberships[0]?.role?.name ?? user.email}</div>
                </div>
                <Badge variant="active">Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Security</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Controls</h2>
              </div>
            </CardHeader>
          <CardContent className="space-y-3">
              {[
                `Current session user: ${data.currentUser.fullName}`,
                `Tenant type: ${data.tenant.type}`,
                `Distinct assigned roles: ${roleCount}`
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm leading-6 text-muted">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Usage</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Platform metrics</h2>
              </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                `${data.users.length} tenant users`,
                `${data.usageCount} access log records`,
                `${roleCount} distinct roles assigned`,
                data.tenant.name
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-surface-subtle px-4 py-4 text-sm font-medium text-foreground">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
