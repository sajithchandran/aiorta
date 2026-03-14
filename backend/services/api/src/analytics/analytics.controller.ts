import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
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

  @RequirePermission(PermissionKey.ANALYSIS_RUN_CREATE)
  @Post("statistical-plans")
  createStatisticalPlan(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateStatisticalPlanDto
  ) {
    return this.analyticsService.createStatisticalPlan(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.ANALYSIS_RUN_CREATE)
  @Post("analysis-runs")
  startAnalysisRun(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateAnalysisRunDto
  ) {
    return this.analyticsService.startAnalysisRun(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("analysis-runs/:analysisRunId")
  getAnalysisRunStatus(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("analysisRunId") analysisRunId: string
  ) {
    return this.analyticsService.getAnalysisRunStatus(tenantId, projectId, analysisRunId);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("analysis-runs/:analysisRunId/artifacts")
  getArtifactSummary(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("analysisRunId") analysisRunId: string
  ) {
    return this.analyticsService.getArtifactSummary(tenantId, projectId, analysisRunId);
  }
}
