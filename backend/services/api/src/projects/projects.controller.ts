import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { CreateProjectDto } from "./dto/create-project.dto";
import { QueryProjectsDto } from "./dto/query-projects.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectsService } from "./projects.service";

@ApiTags("projects")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @RequirePermission(PermissionKey.PROJECT_CREATE)
  @Post()
  createProject(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateProjectDto
  ) {
    return this.projectsService.createProject(tenantId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get()
  listProjects(@CurrentTenant() tenantId: string, @Query() query: QueryProjectsDto) {
    return this.projectsService.listProjects(tenantId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get(":projectId")
  getProjectById(@CurrentTenant() tenantId: string, @Param("projectId") projectId: string) {
    return this.projectsService.getProjectById(tenantId, projectId);
  }

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Patch(":projectId")
  updateProject(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Body() payload: UpdateProjectDto
  ) {
    return this.projectsService.updateProject(tenantId, projectId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_ARCHIVE)
  @Post(":projectId/archive")
  archiveProject(@CurrentTenant() tenantId: string, @Param("projectId") projectId: string) {
    return this.projectsService.archiveProject(tenantId, projectId);
  }
}
