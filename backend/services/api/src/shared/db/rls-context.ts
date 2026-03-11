export interface RlsContextContract {
  readonly purpose: string;
  readonly settings: readonly string[];
}

export const rlsContextContract: RlsContextContract = {
  purpose: "Describe PostgreSQL session settings required for RLS-sensitive requests.",
  settings: ["app.user_id", "app.tenant_id", "app.platform_role"]
};

// TODO: Add helpers for setting session variables inside Prisma transactions.
