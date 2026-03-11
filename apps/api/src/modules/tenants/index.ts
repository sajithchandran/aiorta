import type { ModuleDescriptor } from "../../module.types";

export const tenantsModule: ModuleDescriptor = {
  name: "tenants",
  layer: "domain",
  description: "Tenant creation, tenant settings, and tenant policy ownership.",
  todo: [
    "Define personal, team, and organization tenant flows.",
    "Implement tenant settings and policy storage."
  ]
};
