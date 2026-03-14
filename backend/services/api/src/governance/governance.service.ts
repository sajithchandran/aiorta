import { Injectable, NotFoundException } from "@nestjs/common";
import { IRBSubmissionStatus, Prisma, SignatureStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateApprovalDto } from "./dto/create-approval.dto";
import { CreateIrbSubmissionDto } from "./dto/create-irb-submission.dto";
import { CreateSignatureDto } from "./dto/create-signature.dto";
import { QueryApprovalsDto } from "./dto/query-approvals.dto";
import { QueryIrbSubmissionsDto } from "./dto/query-irb-submissions.dto";
import { QuerySignaturesDto } from "./dto/query-signatures.dto";
import { UpdateApprovalDto } from "./dto/update-approval.dto";
import { UpdateIrbSubmissionDto } from "./dto/update-irb-submission.dto";
import { UpdateSignatureDto } from "./dto/update-signature.dto";

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

  async createSignature(
    tenantId: string,
    projectId: string,
    approvalId: string,
    actorUserId: string,
    payload: CreateSignatureDto
  ) {
    await this.ensureApprovalExists(tenantId, projectId, approvalId);

    return this.prisma.signature.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        approvalId,
        signerId: payload.signerId,
        status: payload.status ?? SignatureStatus.PENDING,
        signatureHash: payload.signatureHash ?? `pending:${payload.signerId}`,
        metadataJson: payload.metadataJson as Prisma.InputJsonValue | undefined,
        signedAt: payload.status === SignatureStatus.SIGNED ? new Date() : undefined
      })
    });
  }

  async listSignatures(
    tenantId: string,
    projectId: string,
    approvalId: string,
    query: QuerySignaturesDto
  ) {
    await this.ensureApprovalExists(tenantId, projectId, approvalId);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = this.tenantPrisma.tenantWhere(tenantId, {
      approvalId,
      ...(query.status ? { status: query.status } : {})
    });

    const [items, total] = await this.prisma.$transaction([
      this.prisma.signature.findMany({
        where,
        orderBy: {
          createdAt: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.signature.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async updateSignature(
    tenantId: string,
    projectId: string,
    approvalId: string,
    signatureId: string,
    actorUserId: string,
    payload: UpdateSignatureDto
  ) {
    await this.ensureApprovalExists(tenantId, projectId, approvalId);

    const signature = await this.prisma.signature.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        id: signatureId,
        approvalId
      }),
      select: {
        id: true
      }
    });

    if (!signature) {
      throw new NotFoundException(`Signature ${signatureId} was not found.`);
    }

    return this.prisma.signature.update({
      where: {
        id: signatureId
      },
      data: {
        ...payload,
        createdById: actorUserId,
        metadataJson: payload.metadataJson as Prisma.InputJsonValue | undefined,
        signedAt: payload.status === SignatureStatus.SIGNED ? new Date() : payload.status === SignatureStatus.REVOKED ? null : undefined
      }
    });
  }

  createIrbSubmission(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateIrbSubmissionDto
  ) {
    return this.prisma.iRBSubmission.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        projectId,
        protocolId: payload.protocolId,
        referenceNumber: payload.referenceNumber,
        status: payload.status ?? IRBSubmissionStatus.DRAFT,
        submissionJson: payload.submissionJson as Prisma.InputJsonValue | undefined
      })
    });
  }

  async listIrbSubmissions(tenantId: string, projectId: string, query: QueryIrbSubmissionsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = this.buildIrbWhere(tenantId, projectId, query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.iRBSubmission.findMany({
        where,
        include: {
          protocol: true
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.iRBSubmission.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async getIrbSubmissionById(tenantId: string, projectId: string, irbSubmissionId: string) {
    const submission = await this.prisma.iRBSubmission.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        id: irbSubmissionId,
        projectId
      }),
      include: {
        protocol: true
      }
    });

    if (!submission) {
      throw new NotFoundException(`IRB submission ${irbSubmissionId} was not found.`);
    }

    return submission;
  }

  async updateIrbSubmission(
    tenantId: string,
    projectId: string,
    irbSubmissionId: string,
    payload: UpdateIrbSubmissionDto
  ) {
    await this.getIrbSubmissionById(tenantId, projectId, irbSubmissionId);

    return this.prisma.iRBSubmission.update({
      where: {
        id: irbSubmissionId
      },
      data: {
        ...payload,
        submissionJson: payload.submissionJson as Prisma.InputJsonValue | undefined,
        submittedAt:
          payload.status === IRBSubmissionStatus.SUBMITTED ? new Date() : undefined,
        approvedAt:
          payload.status === IRBSubmissionStatus.APPROVED ? new Date() : undefined
      }
    });
  }

  private async ensureApprovalExists(
    tenantId: string,
    projectId: string,
    approvalId: string
  ): Promise<void> {
    const approval = await this.prisma.approval.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        id: approvalId,
        projectId
      }),
      select: {
        id: true
      }
    });

    if (!approval) {
      throw new NotFoundException(`Approval ${approvalId} was not found.`);
    }
  }

  private buildIrbWhere(
    tenantId: string,
    projectId: string,
    query: QueryIrbSubmissionsDto
  ): Prisma.IRBSubmissionWhereInput {
    const where: Prisma.IRBSubmissionWhereInput = this.tenantPrisma.tenantWhere(tenantId, {
      projectId
    });

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        {
          referenceNumber: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ];
    }

    return where;
  }
}
