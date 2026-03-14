import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { MembershipsService } from "./memberships.service";

@ApiTags("memberships")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId")
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("memberships")
  listTenantMemberships(@Param("tenantId") tenantId: string) {
    return this.membershipsService.listTenantMemberships(tenantId);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("projects/:projectId/members")
  listProjectMembers(@Param("tenantId") tenantId: string, @Param("projectId") projectId: string) {
    return this.membershipsService.listProjectMembers(tenantId, projectId);
  }
}
