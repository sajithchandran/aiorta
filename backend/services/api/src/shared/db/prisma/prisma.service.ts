export interface PrismaServiceContract {
  readonly clientName: "PrismaService";
  readonly todo: readonly string[];
}

export const prismaServiceContract: PrismaServiceContract = {
  clientName: "PrismaService",
  todo: [
    "Instantiate Prisma client.",
    "Attach lifecycle hooks for NestJS integration."
  ]
};
