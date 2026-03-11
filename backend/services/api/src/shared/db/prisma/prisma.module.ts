export interface PrismaModuleContract {
  readonly name: "PrismaModule";
  readonly purpose: string;
}

export const prismaModuleContract: PrismaModuleContract = {
  name: "PrismaModule",
  purpose: "Provides PrismaService to domain modules."
};

// TODO: Replace with NestJS module decorator and provider wiring.
