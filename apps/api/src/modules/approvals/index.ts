import type { ModuleDescriptor } from "../../module.types";

export const approvalsModule: ModuleDescriptor = {
  name: "approvals",
  layer: "domain",
  description: "Cross-cutting approval checkpoints for datasets, outputs, AI drafts, and exports.",
  todo: [
    "Define approval record model.",
    "Add role-aware approval policies."
  ]
};
