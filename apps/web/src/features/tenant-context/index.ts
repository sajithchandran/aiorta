import type { FrontendAreaDescriptor } from "../../feature.types";

export const tenantContextFeature: FrontendAreaDescriptor = {
  name: "tenant-context",
  category: "feature",
  description: "Active tenant selection and tenant-scoped navigation state.",
  todo: ["Add tenant switcher.", "Add tenant-aware route bootstrap."]
};
