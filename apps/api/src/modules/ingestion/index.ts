import type { ModuleDescriptor } from "../../module.types";

export const ingestionModule: ModuleDescriptor = {
  name: "ingestion",
  layer: "domain",
  description: "Upload registration, parsing orchestration, profiling, and mapping lifecycle.",
  todo: [
    "Register import batches and file metadata.",
    "Queue parsing and validation jobs."
  ]
};
