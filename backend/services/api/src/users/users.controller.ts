import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@ApiBearerAuth()
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("users/me")
  getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getCurrentUser(user.userId);
  }

  @Patch("users/me")
  updateCurrentUser(@CurrentUser() user: AuthenticatedUser, @Body() payload: UpdateUserDto) {
    return this.usersService.updateCurrentUser(user.userId, payload);
  }

  @UseGuards(TenantMembershipGuard, PermissionsGuard)
  @RequirePermission(PermissionKey.TENANT_UPDATE)
  @Post("tenants/:tenantId/users")
  createUser(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateUserDto
  ) {
    return this.usersService.createTenantUser(tenantId, user.userId, payload);
  }

  @UseGuards(TenantMembershipGuard, PermissionsGuard)
  @RequirePermission(PermissionKey.TENANT_READ)
  @Get("tenants/:tenantId/users")
  listUsers(@CurrentTenant() tenantId: string, @Query() query: QueryUsersDto) {
    return this.usersService.listTenantUsers(tenantId, query);
  }

  @UseGuards(TenantMembershipGuard, PermissionsGuard)
  @RequirePermission(PermissionKey.TENANT_READ)
  @Get("tenants/:tenantId/users/:userId")
  getUserById(@CurrentTenant() tenantId: string, @Param("userId") userId: string) {
    return this.usersService.getTenantUserById(tenantId, userId);
  }

  @UseGuards(TenantMembershipGuard, PermissionsGuard)
  @RequirePermission(PermissionKey.TENANT_UPDATE)
  @Patch("tenants/:tenantId/users/:userId")
  updateUserById(
    @CurrentTenant() tenantId: string,
    @Param("userId") userId: string,
    @Body() payload: UpdateUserDto
  ) {
    return this.usersService.updateTenantUser(tenantId, userId, payload);
  }
}
