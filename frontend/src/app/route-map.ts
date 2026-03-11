import type { FrontendAreaDescriptor } from "../feature.types";

export const routeMap: readonly FrontendAreaDescriptor[] = [
  {
    name: "/login",
    category: "route",
    description: "Authentication entry route.",
    todo: ["Add login screen."]
  },
  {
    name: "/select-tenant",
    category: "route",
    description: "Tenant selection route for users with multiple memberships.",
    todo: ["Add tenant selection workflow."]
  },
  {
    name: "/t/[tenantSlug]/dashboard",
    category: "route",
    description: "Tenant dashboard with recent project and approval state.",
    todo: ["Add dashboard layout and data wiring."]
  },
  {
    name: "/t/[tenantSlug]/projects/[projectId]",
    category: "route",
    description: "Project workspace root for downstream research workflows.",
    todo: ["Add nested project route layouts."]
  }
];

// TODO: Replace this descriptor list with actual App Router pages and layouts.
