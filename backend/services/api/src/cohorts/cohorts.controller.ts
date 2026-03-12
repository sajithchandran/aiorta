import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Permissions } from "../common/decorators/permissions.decorator";
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

  @Permissions(PermissionKey.COHORT_CREATE)
  @Post()
  createCohort(
    @Param("tenantId") tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateCohortDto
  ) {
    return this.cohortsService.createCohort(tenantId, projectId, user.userId, payload);
  }

  @Permissions(PermissionKey.COHORT_CREATE)
  @Post(":cohortId/rules")
  addRule(
    @Param("tenantId") tenantId: string,
    @Param("projectId") projectId: string,
    @Param("cohortId") cohortId: string,
    @Body() payload: CreateCohortRuleDto
  ) {
    return this.cohortsService.addRule(tenantId, projectId, cohortId, payload);
  }

  @Permissions(PermissionKey.PROJECT_READ)
  @Get()
  listCohorts(
    @Param("tenantId") tenantId: string,
    @Param("projectId") projectId: string,
    @Query() query: QueryCohortsDto
  ) {
    return this.cohortsService.listCohorts(tenantId, projectId, query);
  }

  @Permissions(PermissionKey.PROJECT_READ)
  @Get(":cohortId/preview")
  previewCohort(
    @Param("tenantId") tenantId: string,
    @Param("projectId") projectId: string,
    @Param("cohortId") cohortId: string
  ) {
    return this.cohortsService.previewCohort(tenantId, projectId, cohortId);
  }
}
