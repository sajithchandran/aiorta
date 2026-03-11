import type { ModuleDescriptor } from "../../module.types";

export const aiOrchestrationModule: ModuleDescriptor = {
  name: "ai-orchestration",
  layer: "domain",
  description: "Evidence bundle orchestration, AI task registration, and validation handoff.",
  todo: [
    "Define evidence bundle contract.",
    "Add AI task request and review flows."
  ]
};
