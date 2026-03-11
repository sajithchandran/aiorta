import type { ModuleDescriptor } from "../../module.types";

export const interceptorsModule: ModuleDescriptor = {
  name: "interceptors",
  layer: "shared",
  description: "Reusable request and response interceptors for auditing and correlation.",
  todo: [
    "Add request id propagation.",
    "Add structured audit interception later where useful."
  ]
};
