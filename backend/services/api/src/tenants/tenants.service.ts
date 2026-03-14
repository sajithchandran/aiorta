import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { QueryTenantsDto } from "./dto/query-tenants.dto";

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async listTenants(userId: string, query: QueryTenantsDto) {
    const where: Prisma.TenantWhereInput = {
      deletedAt: null,
      memberships: {
        some: {
          userId,
          status: "ACTIVE",
          deletedAt: null
        }
      }
    };

    if (query.type) {
      where.type = query.type;
    }

    return this.prisma.tenant.findMany({
      where,
      orderBy: {
        name: "asc"
      }
    });
  }
}
