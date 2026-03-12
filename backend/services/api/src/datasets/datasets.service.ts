import { Injectable, NotImplementedException } from "@nestjs/common";
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

  createDataset(tenantId: string, projectId: string, actorUserId: string, payload: CreateDatasetDto): never {
    const scopedProjectWhere = this.tenantPrisma.tenantWhere(tenantId, { id: projectId });
    const createData = this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
      ...payload,
      projectId
    });
    void scopedProjectWhere;
    void createData;
    // TODO: Persist dataset definition and audit event.
    throw new NotImplementedException("Dataset creation is not implemented yet.");
  }

  createDatasetVersion(
    tenantId: string,
    projectId: string,
    datasetId: string,
    actorUserId: string,
    payload: CreateDatasetVersionDto
  ): never {
    const scopedDatasetWhere = this.tenantPrisma.tenantWhere(tenantId, {
      projectId,
      id: datasetId
    });
    const createData = this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
      ...payload,
      projectId,
      datasetId
    });
    void scopedDatasetWhere;
    void createData;
    // TODO: Queue dataset materialization and persist DatasetVersion in BUILDING state.
    throw new NotImplementedException("Dataset version creation is not implemented yet.");
  }

  listDatasetVersions(
    tenantId: string,
    projectId: string,
    datasetId: string,
    query: QueryDatasetVersionsDto
  ): never {
    void this.tenantPrisma.tenantWhere(tenantId, { projectId, datasetId });
    void query;
    throw new NotImplementedException("Dataset version listing is not implemented yet.");
  }

  getLineageSummary(tenantId: string, projectId: string, datasetId: string): never {
    void this.tenantPrisma.tenantWhere(tenantId, { projectId, id: datasetId });
    throw new NotImplementedException("Dataset lineage summary is not implemented yet.");
  }
}
