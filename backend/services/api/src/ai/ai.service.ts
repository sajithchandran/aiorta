import { Injectable, NotFoundException } from "@nestjs/common";
import { AIJobStatus, AIOutputStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateAiJobDto } from "./dto/create-ai-job.dto";
import { ReviewAiOutputDto } from "./dto/review-ai-output.dto";

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  async createAiJob(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateAiJobDto
  ) {
    return this.prisma.aIJob.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        projectId,
        jobType: payload.jobType,
        datasetVersionId: payload.datasetVersionId,
        analysisRunId: payload.analysisRunId,
        manuscriptId: payload.manuscriptId,
        manuscriptVersionId: payload.manuscriptVersionId,
        manuscriptSectionId: payload.manuscriptSectionId,
        inputBundleJson: payload.inputBundleJson as Prisma.InputJsonValue | undefined,
        status: AIJobStatus.QUEUED
      })
    });
  }

  async getAiOutput(tenantId: string, projectId: string, aiOutputId: string) {
    const output = await this.prisma.aIOutput.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: aiOutputId
      }),
      include: {
        aiJob: true,
        reviews: true
      }
    });

    if (!output) {
      throw new NotFoundException(`AI output ${aiOutputId} was not found.`);
    }

    return output;
  }

  async reviewAiOutput(
    tenantId: string,
    projectId: string,
    aiOutputId: string,
    reviewerId: string,
    payload: ReviewAiOutputDto
  ) {
    const output = await this.prisma.aIOutput.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: aiOutputId
      }),
      select: {
        id: true
      }
    });

    if (!output) {
      throw new NotFoundException(`AI output ${aiOutputId} was not found.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.aIReview.create({
        data: this.tenantPrisma.tenantCreateData(tenantId, reviewerId, {
          aiOutputId,
          reviewerId,
          decision: payload.decision,
          comments: payload.comments
        })
      });

      await tx.aIOutput.update({
        where: {
          id: aiOutputId
        },
        data: {
          status:
            payload.decision === "APPROVED"
              ? AIOutputStatus.APPROVED
              : payload.decision === "REJECTED"
                ? AIOutputStatus.REJECTED
                : AIOutputStatus.READY_FOR_REVIEW
        }
      });

      return review;
    });
  }
}
