import { Injectable, NotImplementedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { QueryProjectsDto } from "./dto/query-projects.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  createProject(tenantId: string, actorUserId: string, payload: CreateProjectDto): never {
    const createData = this.tenantPrisma.tenantCreateData(tenantId, actorUserId, payload);
    void createData;
    // TODO: Persist Project, initial ProjectMember, and audit event in one transaction.
    throw new NotImplementedException("Project creation is not implemented yet.");
  }

  listProjects(tenantId: string, query: QueryProjectsDto): never {
    const scopedWhere = this.tenantPrisma.tenantWhere(tenantId, {});
    void scopedWhere;
    void query;
    // TODO: Apply tenant-scoped filtering, pagination, and project-member visibility rules.
    throw new NotImplementedException("Project listing is not implemented yet.");
  }

  getProjectById(tenantId: string, projectId: string): never {
    const scopedWhere = this.tenantPrisma.tenantWhere(tenantId, { id: projectId });
    void scopedWhere;
    // TODO: Fetch project detail with membership-aware access check.
    throw new NotImplementedException("Project detail is not implemented yet.");
  }

  updateProject(tenantId: string, projectId: string, payload: UpdateProjectDto): never {
    const scopedWhere = this.tenantPrisma.tenantWhere(tenantId, { id: projectId });
    void scopedWhere;
    void payload;
    // TODO: Update allowed project fields and emit audit diff.
    throw new NotImplementedException("Project update is not implemented yet.");
  }

  archiveProject(tenantId: string, projectId: string): never {
    const scopedWhere = this.tenantPrisma.tenantWhere(tenantId, { id: projectId });
    void scopedWhere;
    // TODO: Set project status to ARCHIVED with authorization and audit checks.
    throw new NotImplementedException("Project archive is not implemented yet.");
  }
}
