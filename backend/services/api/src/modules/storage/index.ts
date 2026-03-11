import type { ModuleDescriptor } from "../../module.types";

export const storageModule: ModuleDescriptor = {
  name: "storage",
  layer: "domain",
  description: "Object storage metadata, signed URL issuance, and storage path conventions.",
  todo: [
    "Define storage key helpers.",
    "Add upload and download policy integration."
  ]
};
