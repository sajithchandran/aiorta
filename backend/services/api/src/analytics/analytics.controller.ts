import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Permissions } from "../common/decorators/permissions.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { AnalyticsService } from "./analytics.service";
import { CreateAnalysisRunDto } from "./dto/create-analysis-run.dto";
import { CreateStatisticalPlanDto } from "./dto/create-statistical-plan.dto";

@ApiTags("analytics")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Permissions(PermissionKey.ANALYSIS_RUN_CREATE)
  @Post("statistical-plans")
  createStatisticalPlan(
    @Param("tenantId") tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateStatisticalPlanDto
  ) {
    return this.analyticsService.createStatisticalPlan(tenantId, projectId, user.userId, payload);
  }

  @Permissions(PermissionKey.ANALYSIS_RUN_CREATE)
  @Post("analysis-runs")
  startAnalysisRun(
    @Param("tenantId") tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateAnalysisRunDto
  ) {
    return this.analyticsService.startAnalysisRun(tenantId, projectId, user.userId, payload);
  }

  @Permissions(PermissionKey.PROJECT_READ)
  @Get("analysis-runs/:analysisRunId")
  getAnalysisRunStatus(
    @Param("tenantId") tenantId: string,
    @Param("projectId") projectId: string,
    @Param("analysisRunId") analysisRunId: string
  ) {
    return this.analyticsService.getAnalysisRunStatus(tenantId, projectId, analysisRunId);
  }

  @Permissions(PermissionKey.PROJECT_READ)
  @Get("analysis-runs/:analysisRunId/artifacts")
  getArtifactSummary(
    @Param("tenantId") tenantId: string,
    @Param("projectId") projectId: string,
    @Param("analysisRunId") analysisRunId: string
  ) {
    return this.analyticsService.getArtifactSummary(tenantId, projectId, analysisRunId);
  }
}
