import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { DatasetVersionStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateDatasetDto } from "./dto/create-dataset.dto";
import { CreateDatasetVersionDto } from "./dto/create-dataset-version.dto";
import { QueryDatasetVersionsDto } from "./dto/query-dataset-versions.dto";

@Injectable()
export class DatasetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  async createDataset(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateDatasetDto
  ) {
    await this.ensureProjectExists(tenantId, projectId);

    try {
      return await this.prisma.dataset.create({
        data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
          ...payload,
          projectId
        })
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          `A dataset with name ${payload.name} already exists in this project.`
        );
      }

      throw error;
    }
  }

  async createDatasetVersion(
    tenantId: string,
    projectId: string,
    datasetId: string,
    actorUserId: string,
    payload: CreateDatasetVersionDto
  ) {
    const dataset = await this.prisma.dataset.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: datasetId
      })
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset ${datasetId} was not found.`);
    }

    const latestVersion = await this.prisma.datasetVersion.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        datasetId
      }),
      orderBy: {
        versionNumber: "desc"
      },
      select: {
        versionNumber: true
      }
    });

    return this.prisma.datasetVersion.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        projectId,
        datasetId,
        dataSourceId: dataset.dataSourceId,
        cohortId: payload.cohortId,
        parentVersionId: payload.parentVersionId,
        versionNumber: (latestVersion?.versionNumber ?? 0) + 1,
        status: DatasetVersionStatus.BUILDING
      })
    });
  }

  async listDatasetVersions(
    tenantId: string,
    projectId: string,
    datasetId: string,
    query: QueryDatasetVersionsDto
  ) {
    await this.ensureDatasetExists(tenantId, projectId, datasetId);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = this.tenantPrisma.tenantWhere(tenantId, {
      projectId,
      datasetId
    });

    const [items, total] = await this.prisma.$transaction([
      this.prisma.datasetVersion.findMany({
        where,
        orderBy: {
          versionNumber: "desc"
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.datasetVersion.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async getLineageSummary(tenantId: string, projectId: string, datasetId: string) {
    await this.ensureDatasetExists(tenantId, projectId, datasetId);

    const versions = await this.prisma.datasetVersion.findMany({
      where: this.tenantPrisma.tenantWhere(tenantId, { projectId, datasetId }),
      orderBy: {
        versionNumber: "asc"
      },
      select: {
        id: true,
        versionNumber: true,
        status: true,
        parentVersionId: true,
        cohortId: true,
        dataSourceId: true,
        rowCount: true,
        columnCount: true,
        createdAt: true
      }
    });

    return {
      datasetId,
      versionCount: versions.length,
      versions
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

  private async ensureDatasetExists(
    tenantId: string,
    projectId: string,
    datasetId: string
  ): Promise<void> {
    const dataset = await this.prisma.dataset.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: datasetId
      }),
      select: { id: true }
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset ${datasetId} was not found.`);
    }
  }
}
