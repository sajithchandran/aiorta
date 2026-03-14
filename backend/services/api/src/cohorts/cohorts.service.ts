import { Injectable, NotFoundException } from "@nestjs/common";
import { CohortStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateCohortDto } from "./dto/create-cohort.dto";
import { CreateCohortRuleDto } from "./dto/create-cohort-rule.dto";
import { QueryCohortsDto } from "./dto/query-cohorts.dto";

@Injectable()
export class CohortsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  async createCohort(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateCohortDto
  ) {
    await this.ensureProjectExists(tenantId, projectId);

    return this.prisma.cohort.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        projectId,
        dataSourceId: payload.dataSourceId,
        name: payload.name,
        description: payload.description,
        status: CohortStatus.DRAFT
      })
    });
  }

  async addRule(
    tenantId: string,
    projectId: string,
    cohortId: string,
    actorUserId: string,
    payload: CreateCohortRuleDto
  ) {
    await this.ensureCohortExists(tenantId, projectId, cohortId);

    return this.prisma.cohortRule.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        cohortId,
        parentRuleId: payload.parentRuleId,
        nodeType: payload.nodeType,
        logicalOperator: payload.logicalOperator,
        fieldKey: payload.fieldKey,
        fieldLabel: payload.fieldLabel,
        operator: payload.operator,
        valueJson: payload.valueJson as Prisma.InputJsonValue | undefined,
        sortOrder: payload.sortOrder ?? 0
      })
    });
  }

  async listCohorts(tenantId: string, projectId: string, query: QueryCohortsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = this.tenantPrisma.tenantWhere(tenantId, { projectId });

    const [items, total] = await this.prisma.$transaction([
      this.prisma.cohort.findMany({
        where,
        include: {
          _count: {
            select: {
              rules: true,
              datasetVersions: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.cohort.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async previewCohort(tenantId: string, projectId: string, cohortId: string) {
    const cohort = await this.prisma.cohort.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, { projectId, id: cohortId }),
      include: {
        rules: {
          where: {
            tenantId,
            deletedAt: null
          },
          orderBy: [{ parentRuleId: "asc" }, { sortOrder: "asc" }]
        }
      }
    });

    if (!cohort) {
      throw new NotFoundException(`Cohort ${cohortId} was not found.`);
    }

    return {
      cohortId: cohort.id,
      name: cohort.name,
      status: cohort.status,
      versionNumber: cohort.versionNumber,
      snapshotAt: cohort.snapshotAt,
      subjectCount: cohort.subjectCount,
      ruleCount: cohort.rules.length,
      rules: cohort.rules
    };
  }

  private async ensureProjectExists(tenantId: string, projectId: string): Promise<void> {
    const project = await this.prisma.project.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, { id: projectId }),
      select: { id: true }
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found.`);
    }
  }

  private async ensureCohortExists(
    tenantId: string,
    projectId: string,
    cohortId: string
  ): Promise<void> {
    const cohort = await this.prisma.cohort.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: cohortId
      }),
      select: { id: true }
    });

    if (!cohort) {
      throw new NotFoundException(`Cohort ${cohortId} was not found.`);
    }
  }
}
