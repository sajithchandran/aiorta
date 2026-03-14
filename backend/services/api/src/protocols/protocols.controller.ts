import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { CreateProtocolDto } from "./dto/create-protocol.dto";
import { QueryProtocolsDto } from "./dto/query-protocols.dto";
import { UpdateProtocolDto } from "./dto/update-protocol.dto";
import { ProtocolsService } from "./protocols.service";

@ApiTags("protocols")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId/protocols")
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) {}

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Post()
  createProtocol(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateProtocolDto
  ) {
    return this.protocolsService.createProtocol(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get()
  listProtocols(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Query() query: QueryProtocolsDto
  ) {
    return this.protocolsService.listProtocols(tenantId, projectId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get(":protocolId")
  getProtocolById(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("protocolId") protocolId: string
  ) {
    return this.protocolsService.getProtocolById(tenantId, projectId, protocolId);
  }

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Patch(":protocolId")
  updateProtocol(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("protocolId") protocolId: string,
    @Body() payload: UpdateProtocolDto
  ) {
    return this.protocolsService.updateProtocol(tenantId, projectId, protocolId, payload);
  }
}
