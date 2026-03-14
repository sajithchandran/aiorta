import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { QueryAuditLogsDto } from "./dto/query-audit-logs.dto";
import { AuditService } from "./audit.service";

@ApiTags("audit")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @RequirePermission(PermissionKey.AUDIT_READ)
  @Get("projects/:projectId/audit-logs")
  listProjectAuditLogs(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Query() query: QueryAuditLogsDto
  ) {
    return this.auditService.listAuditLogs(tenantId, { ...query, projectId });
  }

  @RequirePermission(PermissionKey.AUDIT_READ)
  @Get("access-logs")
  listTenantAccessLogs(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryAuditLogsDto
  ) {
    return this.auditService.listAccessLogs(tenantId, query);
  }
}
