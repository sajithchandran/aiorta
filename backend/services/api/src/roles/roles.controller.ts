import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { RolesService } from "./roles.service";

@ApiTags("roles")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("roles")
  listRoles(@Param("tenantId") tenantId: string) {
    return this.rolesService.listRoles(tenantId);
  }
}
