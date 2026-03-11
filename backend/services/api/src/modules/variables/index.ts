import type { ModuleDescriptor } from "../../module.types";

export const variablesModule: ModuleDescriptor = {
  name: "variables",
  layer: "domain",
  description: "Canonical research variable definitions used by ingestion and cohorting.",
  todo: [
    "Define canonical variable registry.",
    "Add typing and unit metadata."
  ]
};
