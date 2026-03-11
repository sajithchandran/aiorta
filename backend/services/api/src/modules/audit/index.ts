import type { ModuleDescriptor } from "../../module.types";

export const auditModule: ModuleDescriptor = {
  name: "audit",
  layer: "domain",
  description: "Append-only audit, data access events, and security event registration.",
  todo: [
    "Define audit event schema.",
    "Add data-access and security event streams."
  ]
};
