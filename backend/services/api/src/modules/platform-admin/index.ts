import type { ModuleDescriptor } from "../../module.types";

export const platformAdminModule: ModuleDescriptor = {
  name: "platform-admin",
  layer: "domain",
  description: "Platform-wide administration features outside tenant-owned workflows.",
  todo: [
    "Define restricted admin operations.",
    "Add explicit audit hooks for privileged actions."
  ]
};
