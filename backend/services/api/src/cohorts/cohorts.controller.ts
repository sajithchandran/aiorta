import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { CohortsService } from "./cohorts.service";
import { CreateCohortDto } from "./dto/create-cohort.dto";
import { CreateCohortRuleDto } from "./dto/create-cohort-rule.dto";
import { QueryCohortsDto } from "./dto/query-cohorts.dto";

@ApiTags("cohorts")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId/cohorts")
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @RequirePermission(PermissionKey.COHORT_CREATE)
  @Post()
  createCohort(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateCohortDto
  ) {
    return this.cohortsService.createCohort(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.COHORT_CREATE)
  @Post(":cohortId/rules")
  addRule(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("cohortId") cohortId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateCohortRuleDto
  ) {
    return this.cohortsService.addRule(tenantId, projectId, cohortId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get()
  listCohorts(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Query() query: QueryCohortsDto
  ) {
    return this.cohortsService.listCohorts(tenantId, projectId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get(":cohortId/preview")
  previewCohort(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("cohortId") cohortId: string
  ) {
    return this.cohortsService.previewCohort(tenantId, projectId, cohortId);
  }
}
