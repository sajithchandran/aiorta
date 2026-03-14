import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { CreateApprovalDto } from "./dto/create-approval.dto";
import { QueryApprovalsDto } from "./dto/query-approvals.dto";
import { UpdateApprovalDto } from "./dto/update-approval.dto";
import { GovernanceService } from "./governance.service";

@ApiTags("governance")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId/approvals")
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Post()
  createApproval(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateApprovalDto
  ) {
    return this.governanceService.createApproval(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get()
  listApprovals(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Query() query: QueryApprovalsDto
  ) {
    return this.governanceService.listApprovals(tenantId, projectId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Patch(":approvalId")
  updateApproval(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("approvalId") approvalId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: UpdateApprovalDto
  ) {
    return this.governanceService.updateApproval(
      tenantId,
      projectId,
      approvalId,
      user.userId,
      payload
    );
  }
}
