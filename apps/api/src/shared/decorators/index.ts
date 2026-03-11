import type { ModuleDescriptor } from "../../module.types";

export const decoratorsModule: ModuleDescriptor = {
  name: "decorators",
  layer: "shared",
  description: "Custom parameter and route decorators for request metadata extraction.",
  todo: [
    "Add actor and tenant parameter decorators.",
    "Add policy marker decorators as needed."
  ]
};
