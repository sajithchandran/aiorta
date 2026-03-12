import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on("beforeExit" as never, async () => {
      await app.close();
    });
  }

  buildTenantWhere<TWhere extends Record<string, unknown>>(
    tenantId: string,
    where: TWhere = {} as TWhere
  ): TWhere & { tenantId: string; deletedAt: null } {
    return {
      ...where,
      tenantId,
      deletedAt: null
    };
  }
}
