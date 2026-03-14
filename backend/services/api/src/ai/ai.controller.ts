import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { AiService } from "./ai.service";
import { CreateAiJobDto } from "./dto/create-ai-job.dto";
import { ReviewAiOutputDto } from "./dto/review-ai-output.dto";

@ApiTags("ai")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @RequirePermission(PermissionKey.AI_JOB_CREATE)
  @Post("ai-jobs")
  createAiJob(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateAiJobDto
  ) {
    return this.aiService.createAiJob(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("ai-outputs/:aiOutputId")
  getAiOutput(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("aiOutputId") aiOutputId: string
  ) {
    return this.aiService.getAiOutput(tenantId, projectId, aiOutputId);
  }

  @RequirePermission(PermissionKey.AI_JOB_CREATE)
  @Post("ai-outputs/:aiOutputId/reviews")
  reviewAiOutput(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("aiOutputId") aiOutputId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: ReviewAiOutputDto
  ) {
    return this.aiService.reviewAiOutput(tenantId, projectId, aiOutputId, user.userId, payload);
  }
}
