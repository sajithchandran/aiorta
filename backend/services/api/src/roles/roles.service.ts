import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  listRoles(tenantId: string) {
    return this.prisma.role.findMany({
      where: {
        OR: [{ tenantId }, { tenantId: null }],
        deletedAt: null
      },
      include: {
        rolePermissions: {
          where: {
            deletedAt: null
          },
          include: {
            permission: true
          }
        }
      },
      orderBy: [{ isSystem: "desc" }, { name: "asc" }]
    });
  }
}
