import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Permissions } from "../common/decorators/permissions.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { QueryAuditLogsDto } from "./dto/query-audit-logs.dto";
import { AuditService } from "./audit.service";

@ApiTags("audit")
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Permissions(PermissionKey.AUDIT_READ)
  @Get("projects/:projectId/audit-logs")
  listProjectAuditLogs(
    @Param("tenantId") tenantId: string,
    @Query() query: QueryAuditLogsDto
  ) {
    return this.auditService.listAuditLogs(tenantId, query);
  }

  @Permissions(PermissionKey.AUDIT_READ)
  @Get("access-logs")
  listTenantAccessLogs(
    @Param("tenantId") tenantId: string,
    @Query() query: QueryAuditLogsDto
  ) {
    return this.auditService.listAccessLogs(tenantId, query);
  }
}
