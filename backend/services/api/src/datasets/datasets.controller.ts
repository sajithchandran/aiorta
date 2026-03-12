import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { CreateDatasetDto } from "./dto/create-dataset.dto";
import { CreateDatasetVersionDto } from "./dto/create-dataset-version.dto";
import { QueryDatasetVersionsDto } from "./dto/query-dataset-versions.dto";
import { DatasetsService } from "./datasets.service";

@ApiTags("datasets")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId/datasets")
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @RequirePermission(PermissionKey.DATASET_CREATE)
  @Post()
  createDataset(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateDatasetDto
  ) {
    return this.datasetsService.createDataset(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.DATASET_CREATE)
  @Post(":datasetId/versions")
  createDatasetVersion(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("datasetId") datasetId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateDatasetVersionDto
  ) {
    return this.datasetsService.createDatasetVersion(
      tenantId,
      projectId,
      datasetId,
      user.userId,
      payload
    );
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get(":datasetId/versions")
  listDatasetVersions(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("datasetId") datasetId: string,
    @Query() query: QueryDatasetVersionsDto
  ) {
    return this.datasetsService.listDatasetVersions(tenantId, projectId, datasetId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get(":datasetId/lineage")
  getLineageSummary(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("datasetId") datasetId: string
  ) {
    return this.datasetsService.getLineageSummary(tenantId, projectId, datasetId);
  }
}
