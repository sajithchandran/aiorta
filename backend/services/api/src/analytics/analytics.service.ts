import { Injectable, NotFoundException } from "@nestjs/common";
import { AnalysisRunStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateAnalysisRunDto } from "./dto/create-analysis-run.dto";
import { CreateStatisticalPlanDto } from "./dto/create-statistical-plan.dto";
import { QueryAnalysisRunsDto } from "./dto/query-analysis-runs.dto";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  async createStatisticalPlan(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateStatisticalPlanDto
  ) {
    const latestVersion = await this.prisma.statisticalPlan.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        name: payload.name
      }),
      orderBy: {
        version: "desc"
      },
      select: {
        version: true
      }
    });

    return this.prisma.statisticalPlan.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        projectId,
        name: payload.name,
        planJson: payload.planJson as Prisma.InputJsonValue,
        version: (latestVersion?.version ?? 0) + 1
      })
    });
  }

  async startAnalysisRun(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateAnalysisRunDto
  ) {
    await this.ensureDatasetVersionExists(tenantId, projectId, payload.datasetVersionId);

    return this.prisma.analysisRun.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        projectId,
        datasetVersionId: payload.datasetVersionId,
        statisticalPlanId: payload.statisticalPlanId,
        parametersJson: payload.parametersJson as Prisma.InputJsonValue | undefined,
        status: AnalysisRunStatus.QUEUED
      })
    });
  }

  async listAnalysisRuns(tenantId: string, projectId: string, query: QueryAnalysisRunsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = this.tenantPrisma.tenantWhere(tenantId, {
      projectId,
      ...(query.status ? { status: query.status } : {})
    });

    const [items, total] = await this.prisma.$transaction([
      this.prisma.analysisRun.findMany({
        where,
        include: {
          datasetVersion: true,
          statisticalPlan: true
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.analysisRun.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async getAnalysisRunStatus(tenantId: string, projectId: string, analysisRunId: string) {
    const run = await this.prisma.analysisRun.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, { projectId, id: analysisRunId }),
      include: {
        datasetVersion: true,
        statisticalPlan: true
      }
    });

    if (!run) {
      throw new NotFoundException(`Analysis run ${analysisRunId} was not found.`);
    }

    return run;
  }

  async getArtifactSummary(tenantId: string, projectId: string, analysisRunId: string) {
    await this.ensureAnalysisRunExists(tenantId, projectId, analysisRunId);

    const results = await this.prisma.analysisResult.findMany({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        analysisRunId
      }),
      include: {
        resultTables: true,
        resultFigures: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return {
      analysisRunId,
      resultCount: results.length,
      tableCount: results.reduce((count, result) => count + result.resultTables.length, 0),
      figureCount: results.reduce((count, result) => count + result.resultFigures.length, 0),
      results
    };
  }

  private async ensureDatasetVersionExists(
    tenantId: string,
    projectId: string,
    datasetVersionId: string
  ): Promise<void> {
    const datasetVersion = await this.prisma.datasetVersion.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: datasetVersionId
      }),
      select: { id: true }
    });

    if (!datasetVersion) {
      throw new NotFoundException(`Dataset version ${datasetVersionId} was not found.`);
    }
  }

  private async ensureAnalysisRunExists(
    tenantId: string,
    projectId: string,
    analysisRunId: string
  ): Promise<void> {
    const analysisRun = await this.prisma.analysisRun.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: analysisRunId
      }),
      select: { id: true }
    });

    if (!analysisRun) {
      throw new NotFoundException(`Analysis run ${analysisRunId} was not found.`);
    }
  }
}
