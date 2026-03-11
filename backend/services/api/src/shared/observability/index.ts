import type { ModuleDescriptor } from "../../module.types";

export const observabilityModule: ModuleDescriptor = {
  name: "observability",
  layer: "shared",
  description: "Logging, metrics, and tracing placeholders for operational visibility.",
  todo: [
    "Define log shape.",
    "Add metrics and tracing contracts."
  ]
};
