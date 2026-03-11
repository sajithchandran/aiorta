import type { ModuleDescriptor } from "../../module.types";

export const datasetsModule: ModuleDescriptor = {
  name: "datasets",
  layer: "domain",
  description: "Immutable dataset versioning, lineage, and approval.",
  todo: [
    "Define dataset and dataset version models.",
    "Implement lineage edge registration."
  ]
};
