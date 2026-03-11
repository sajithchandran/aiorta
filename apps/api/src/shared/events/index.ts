import type { ModuleDescriptor } from "../../module.types";

export const eventsModule: ModuleDescriptor = {
  name: "events",
  layer: "shared",
  description: "Internal domain and integration event contract definitions.",
  todo: [
    "Define event naming conventions.",
    "Add event publisher abstraction only if needed."
  ]
};
