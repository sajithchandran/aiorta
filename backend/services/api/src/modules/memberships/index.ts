import type { ModuleDescriptor } from "../../module.types";

export const membershipsModule: ModuleDescriptor = {
  name: "memberships",
  layer: "domain",
  description: "Tenant and project membership assignment and role resolution.",
  todo: [
    "Define tenant membership queries.",
    "Add project membership role transitions."
  ]
};
