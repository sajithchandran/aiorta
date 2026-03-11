import type { ModuleDescriptor } from "../../module.types";

export const configModule: ModuleDescriptor = {
  name: "config",
  layer: "shared",
  description: "Typed configuration loading for the API application.",
  todo: [
    "Define required env vars.",
    "Add config validation."
  ]
};
