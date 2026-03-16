import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentTenant } from "../common/decorators/current-tenant.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { PermissionKey } from "../common/enums/permission-key.enum";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantMembershipGuard } from "../common/guards/tenant-membership.guard";
import { AuthenticatedUser } from "../common/types/authenticated-user.type";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { QueryDocumentsDto } from "./dto/query-documents.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { DocumentsService } from "./documents.service";

@ApiTags("documents")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId/documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Post()
  createDocument(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateDocumentDto
  ) {
    return this.documentsService.createDocument(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get()
  listDocuments(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Query() query: QueryDocumentsDto
  ) {
    return this.documentsService.listDocuments(tenantId, projectId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get(":documentId")
  getDocumentById(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("documentId") documentId: string
  ) {
    return this.documentsService.getDocumentById(tenantId, projectId, documentId);
  }

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Patch(":documentId")
  updateDocument(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("documentId") documentId: string,
    @Body() payload: UpdateDocumentDto
  ) {
    return this.documentsService.updateDocument(tenantId, projectId, documentId, payload);
  }
}
