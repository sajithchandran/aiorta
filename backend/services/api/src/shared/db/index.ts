import type { ModuleDescriptor } from "../../module.types";

export const dbModule: ModuleDescriptor = {
  name: "db",
  layer: "shared",
  description: "Prisma client access, transaction helpers, and RLS context setup.",
  todo: [
    "Add PrismaService wiring.",
    "Add transaction and RLS context helpers."
  ]
};
