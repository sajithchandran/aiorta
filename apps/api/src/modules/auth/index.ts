import type { ModuleDescriptor } from "../../module.types";

export const authModule: ModuleDescriptor = {
  name: "auth",
  layer: "domain",
  description: "Authentication, session issuance, and request identity resolution.",
  todo: [
    "Add JWT and session strategy.",
    "Implement login, refresh, and logout flows."
  ]
};
