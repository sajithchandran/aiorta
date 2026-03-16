import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { CreateManuscriptDto } from "./dto/create-manuscript.dto";
import { CreateManuscriptVersionDto } from "./dto/create-manuscript-version.dto";
import { UpdateManuscriptSectionDto } from "./dto/update-manuscript-section.dto";
import { ManuscriptsService } from "./manuscripts.service";

@ApiTags("manuscripts")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId")
export class ManuscriptsController {
  constructor(private readonly manuscriptsService: ManuscriptsService) {}

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("manuscripts")
  listManuscripts(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string
  ) {
    return this.manuscriptsService.listManuscripts(tenantId, projectId);
  }

  @RequirePermission(PermissionKey.MANUSCRIPT_CREATE)
  @Post("manuscripts")
  createManuscript(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateManuscriptDto
  ) {
    return this.manuscriptsService.createManuscript(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.MANUSCRIPT_CREATE)
  @Post("manuscripts/:manuscriptId/versions")
  createVersion(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("manuscriptId") manuscriptId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateManuscriptVersionDto
  ) {
    return this.manuscriptsService.createVersion(
      tenantId,
      projectId,
      manuscriptId,
      user.userId,
      payload
    );
  }

  @RequirePermission(PermissionKey.MANUSCRIPT_CREATE)
  @Patch("manuscript-versions/:manuscriptVersionId/sections/:sectionId")
  updateSection(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("manuscriptVersionId") manuscriptVersionId: string,
    @Param("sectionId") sectionId: string,
    @Body() payload: UpdateManuscriptSectionDto
  ) {
    return this.manuscriptsService.updateSection(
      tenantId,
      projectId,
      manuscriptVersionId,
      sectionId,
      payload
    );
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("manuscripts/:manuscriptId/versions")
  listVersions(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("manuscriptId") manuscriptId: string
  ) {
    return this.manuscriptsService.listVersions(tenantId, projectId, manuscriptId);
  }
}
