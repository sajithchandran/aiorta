import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  listTenantMemberships(tenantId: string) {
    return this.prisma.tenantMembership.findMany({
      where: {
        tenantId,
        deletedAt: null
      },
      orderBy: {
        createdAt: "asc"
      },
      include: {
        user: true,
        role: true
      }
    });
  }

  listProjectMembers(tenantId: string, projectId: string) {
    return this.prisma.projectMember.findMany({
      where: {
        tenantId,
        projectId,
        deletedAt: null
      },
      orderBy: {
        createdAt: "asc"
      },
      include: {
        user: true,
        role: true
      }
    });
  }
}
