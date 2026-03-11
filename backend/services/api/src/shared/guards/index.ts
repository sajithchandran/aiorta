import type { ModuleDescriptor } from "../../module.types";

export const guardsModule: ModuleDescriptor = {
  name: "guards",
  layer: "shared",
  description: "Reusable request guards for auth, tenant, and project access.",
  todo: [
    "Add auth guard placeholder.",
    "Add tenant and project guards."
  ]
};
