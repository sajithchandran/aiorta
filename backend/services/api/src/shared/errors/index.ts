import type { ModuleDescriptor } from "../../module.types";

export const errorsModule: ModuleDescriptor = {
  name: "errors",
  layer: "shared",
  description: "Shared application error contracts and machine-readable codes.",
  todo: [
    "Define error code catalog.",
    "Add API error mapping helpers."
  ]
};
