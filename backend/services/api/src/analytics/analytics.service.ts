import { Injectable, NotImplementedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAnalysisRunDto } from "./dto/create-analysis-run.dto";
import { CreateStatisticalPlanDto } from "./dto/create-statistical-plan.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  createStatisticalPlan(tenantId: string, projectId: string, actorUserId: string, payload: CreateStatisticalPlanDto): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId });
    void actorUserId;
    void payload;
    throw new NotImplementedException("Statistical plan creation is not implemented yet.");
  }

  startAnalysisRun(tenantId: string, projectId: string, actorUserId: string, payload: CreateAnalysisRunDto): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId });
    void actorUserId;
    void payload;
    // TODO: Create AnalysisRun in QUEUED state and hand off to jobs module.
    throw new NotImplementedException("Analysis run creation is not implemented yet.");
  }

  getAnalysisRunStatus(tenantId: string, projectId: string, analysisRunId: string): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: analysisRunId });
    throw new NotImplementedException("Analysis run status is not implemented yet.");
  }

  getArtifactSummary(tenantId: string, projectId: string, analysisRunId: string): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: analysisRunId });
    throw new NotImplementedException("Analysis artifact summary is not implemented yet.");
  }
}
