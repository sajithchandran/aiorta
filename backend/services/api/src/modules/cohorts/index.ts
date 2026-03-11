import type { ModuleDescriptor } from "../../module.types";

export const cohortsModule: ModuleDescriptor = {
  name: "cohorts",
  layer: "domain",
  description: "Cohort definition, preview, and immutable snapshot management.",
  todo: [
    "Define cohort criteria model.",
    "Implement snapshot orchestration boundary."
  ]
};
