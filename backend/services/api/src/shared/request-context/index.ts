import type { ModuleDescriptor } from "../../module.types";

export const requestContextModule: ModuleDescriptor = {
  name: "request-context",
  layer: "shared",
  description: "Per-request actor, tenant, project, and correlation metadata.",
  todo: [
    "Add request-scoped context storage.",
    "Expose context to guards and repositories."
  ]
};
