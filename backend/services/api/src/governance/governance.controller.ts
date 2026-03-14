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
import { CreateIrbSubmissionDto } from "./dto/create-irb-submission.dto";
import { CreateSignatureDto } from "./dto/create-signature.dto";
import { QueryApprovalsDto } from "./dto/query-approvals.dto";
import { QueryIrbSubmissionsDto } from "./dto/query-irb-submissions.dto";
import { QuerySignaturesDto } from "./dto/query-signatures.dto";
import { UpdateApprovalDto } from "./dto/update-approval.dto";
import { UpdateIrbSubmissionDto } from "./dto/update-irb-submission.dto";
import { UpdateSignatureDto } from "./dto/update-signature.dto";
import { GovernanceService } from "./governance.service";

@ApiTags("governance")
@ApiBearerAuth()
@UseGuards(TenantMembershipGuard, PermissionsGuard)
@Controller("tenants/:tenantId/projects/:projectId")
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Post("approvals")
  createApproval(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateApprovalDto
  ) {
    return this.governanceService.createApproval(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("approvals")
  listApprovals(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Query() query: QueryApprovalsDto
  ) {
    return this.governanceService.listApprovals(tenantId, projectId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Patch("approvals/:approvalId")
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

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Post("approvals/:approvalId/signatures")
  createSignature(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("approvalId") approvalId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateSignatureDto
  ) {
    return this.governanceService.createSignature(
      tenantId,
      projectId,
      approvalId,
      user.userId,
      payload
    );
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("approvals/:approvalId/signatures")
  listSignatures(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("approvalId") approvalId: string,
    @Query() query: QuerySignaturesDto
  ) {
    return this.governanceService.listSignatures(tenantId, projectId, approvalId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Patch("approvals/:approvalId/signatures/:signatureId")
  updateSignature(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("approvalId") approvalId: string,
    @Param("signatureId") signatureId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: UpdateSignatureDto
  ) {
    return this.governanceService.updateSignature(
      tenantId,
      projectId,
      approvalId,
      signatureId,
      user.userId,
      payload
    );
  }

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Post("irb-submissions")
  createIrbSubmission(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateIrbSubmissionDto
  ) {
    return this.governanceService.createIrbSubmission(tenantId, projectId, user.userId, payload);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("irb-submissions")
  listIrbSubmissions(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Query() query: QueryIrbSubmissionsDto
  ) {
    return this.governanceService.listIrbSubmissions(tenantId, projectId, query);
  }

  @RequirePermission(PermissionKey.PROJECT_READ)
  @Get("irb-submissions/:irbSubmissionId")
  getIrbSubmissionById(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("irbSubmissionId") irbSubmissionId: string
  ) {
    return this.governanceService.getIrbSubmissionById(tenantId, projectId, irbSubmissionId);
  }

  @RequirePermission(PermissionKey.PROJECT_UPDATE)
  @Patch("irb-submissions/:irbSubmissionId")
  updateIrbSubmission(
    @CurrentTenant() tenantId: string,
    @Param("projectId") projectId: string,
    @Param("irbSubmissionId") irbSubmissionId: string,
    @Body() payload: UpdateIrbSubmissionDto
  ) {
    return this.governanceService.updateIrbSubmission(
      tenantId,
      projectId,
      irbSubmissionId,
      payload
    );
  }
}
