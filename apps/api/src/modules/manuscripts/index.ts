import type { ModuleDescriptor } from "../../module.types";

export const manuscriptsModule: ModuleDescriptor = {
  name: "manuscripts",
  layer: "domain",
  description: "Manuscript versioning, section management, and export approval.",
  todo: [
    "Define manuscript version model.",
    "Add export approval boundary."
  ]
};
