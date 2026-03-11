import type { ModuleDescriptor } from "../../module.types";

export const identityModule: ModuleDescriptor = {
  name: "identity",
  layer: "domain",
  description: "User identity records, invitations, and actor profile management.",
  todo: [
    "Define user profile model.",
    "Add invitation and acceptance flows."
  ]
};
