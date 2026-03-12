import { Injectable, NotImplementedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAiJobDto } from "./dto/create-ai-job.dto";
import { ReviewAiOutputDto } from "./dto/review-ai-output.dto";

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  createAiJob(tenantId: string, projectId: string, actorUserId: string, payload: CreateAiJobDto): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId });
    void actorUserId;
    void payload;
    // TODO: Validate approved evidence inputs and persist AIJob in QUEUED state.
    throw new NotImplementedException("AI job creation is not implemented yet.");
  }

  getAiOutput(tenantId: string, projectId: string, aiOutputId: string): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: aiOutputId });
    throw new NotImplementedException("AI output retrieval is not implemented yet.");
  }

  reviewAiOutput(
    tenantId: string,
    projectId: string,
    aiOutputId: string,
    reviewerId: string,
    payload: ReviewAiOutputDto
  ): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: aiOutputId });
    void reviewerId;
    void payload;
    throw new NotImplementedException("AI output review is not implemented yet.");
  }
}
