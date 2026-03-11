import type { ModuleDescriptor } from "../../module.types";

export const accessControlModule: ModuleDescriptor = {
  name: "access-control",
  layer: "shared",
  description: "Role and policy evaluation helpers shared across modules.",
  todo: [
    "Define tenant and project permission primitives.",
    "Add resource-state policy checks."
  ]
};
