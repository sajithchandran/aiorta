import type { ModuleDescriptor } from "../../module.types";

export const studiesModule: ModuleDescriptor = {
  name: "studies",
  layer: "domain",
  description: "Study metadata layered within project workspaces.",
  todo: [
    "Define study metadata boundary.",
    "Clarify study/project split in implementation."
  ]
};
