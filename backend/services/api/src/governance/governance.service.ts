import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateApprovalDto } from "./dto/create-approval.dto";
import { QueryApprovalsDto } from "./dto/query-approvals.dto";
import { UpdateApprovalDto } from "./dto/update-approval.dto";

@Injectable()
export class GovernanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  createApproval(tenantId: string, projectId: string, actorUserId: string, payload: CreateApprovalDto) {
    return this.prisma.approval.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        projectId,
        targetType: payload.targetType,
        targetId: payload.targetId,
        requestedById: actorUserId
      })
    });
  }

  async listApprovals(tenantId: string, projectId: string, query: QueryApprovalsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = this.tenantPrisma.tenantWhere(tenantId, { projectId });

    const [items, total] = await this.prisma.$transaction([
      this.prisma.approval.findMany({
        where,
        include: {
          signatures: true
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.approval.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async updateApproval(
    tenantId: string,
    projectId: string,
    approvalId: string,
    actorUserId: string,
    payload: UpdateApprovalDto
  ) {
    const approval = await this.prisma.approval.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: approvalId
      }),
      select: {
        id: true
      }
    });

    if (!approval) {
      throw new NotFoundException(`Approval ${approvalId} was not found.`);
    }

    return this.prisma.approval.update({
      where: {
        id: approvalId
      },
      data: {
        ...payload,
        decidedById: payload.status ? actorUserId : undefined,
        decidedAt: payload.status ? new Date() : undefined
      }
    });
  }
}
