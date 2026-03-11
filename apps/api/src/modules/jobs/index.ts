import type { ModuleDescriptor } from "../../module.types";

export const jobsModule: ModuleDescriptor = {
  name: "jobs",
  layer: "domain",
  description: "Queue registration and background job orchestration metadata.",
  todo: [
    "Define BullMQ queue names.",
    "Add shared job payload contracts."
  ]
};
