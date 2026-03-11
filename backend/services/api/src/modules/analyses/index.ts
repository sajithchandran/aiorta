import type { ModuleDescriptor } from "../../module.types";

export const analysesModule: ModuleDescriptor = {
  name: "analyses",
  layer: "domain",
  description: "Analysis specs, queued execution requests, and run metadata.",
  todo: [
    "Define analysis catalog and spec types.",
    "Add worker handoff contracts."
  ]
};
