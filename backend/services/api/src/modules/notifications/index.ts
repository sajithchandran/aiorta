import type { ModuleDescriptor } from "../../module.types";

export const notificationsModule: ModuleDescriptor = {
  name: "notifications",
  layer: "domain",
  description: "User notification registration for invites, job completion, and review tasks.",
  todo: [
    "Define notification event types.",
    "Add delivery channel abstraction later if needed."
  ]
};
