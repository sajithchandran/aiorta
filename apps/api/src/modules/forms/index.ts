import type { ModuleDescriptor } from "../../module.types";

export const formsModule: ModuleDescriptor = {
  name: "forms",
  layer: "domain",
  description: "eCRF and form definition lifecycle.",
  todo: [
    "Define form versioning.",
    "Add form field and validation rule models."
  ]
};
