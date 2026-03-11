import type { ModuleDescriptor } from "../../module.types";

export const projectsModule: ModuleDescriptor = {
  name: "projects",
  layer: "domain",
  description: "Project workspace lifecycle and project-scoped collaboration.",
  todo: [
    "Define project aggregate shape.",
    "Add project membership and settings flows."
  ]
};
