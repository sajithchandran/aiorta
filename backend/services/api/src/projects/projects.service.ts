import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Prisma, Project, ProjectStatus } from "@prisma/client";
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

  async createProject(
    tenantId: string,
    actorUserId: string,
    payload: CreateProjectDto
  ): Promise<Project> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const membership = await tx.tenantMembership.findFirst({
          where: {
            tenantId,
            userId: actorUserId,
            status: "ACTIVE",
            deletedAt: null
          },
          select: {
            roleId: true
          }
        });

        if (!membership) {
          throw new NotFoundException("Active tenant membership was not found.");
        }

        const project = await tx.project.create({
          data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
            title: payload.title,
            code: payload.code,
            slug: payload.slug,
            description: payload.description,
            status: payload.status ?? ProjectStatus.DRAFT
          })
        });

        await tx.projectMember.create({
          data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
            projectId: project.id,
            userId: actorUserId,
            roleId: membership.roleId
          })
        });

        return project;
      });
    } catch (error) {
      this.handleProjectWriteError(error, payload.slug);
    }
  }

  async listProjects(
    tenantId: string,
    query: QueryProjectsDto
  ): Promise<{
    success: true;
    items: Project[];
    page: number;
    pageSize: number;
    total: number;
  }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where = this.buildProjectWhere(tenantId, query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: pageSize
      }),
      this.prisma.project.count({ where })
    ]);

    return {
      success: true,
      items,
      page,
      pageSize,
      total
    };
  }

  async getProjectById(tenantId: string, projectId: string): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, { id: projectId })
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found.`);
    }

    return project;
  }

  async updateProject(
    tenantId: string,
    projectId: string,
    payload: UpdateProjectDto
  ): Promise<Project> {
    await this.ensureProjectExists(tenantId, projectId);

    return this.prisma.project.update({
      where: {
        id: projectId
      },
      data: payload
    });
  }

  async archiveProject(tenantId: string, projectId: string): Promise<Project> {
    await this.ensureProjectExists(tenantId, projectId);

    return this.prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        status: ProjectStatus.ARCHIVED
      }
    });
  }

  private buildProjectWhere(
    tenantId: string,
    query: QueryProjectsDto
  ): Prisma.ProjectWhereInput {
    const where: Prisma.ProjectWhereInput = this.tenantPrisma.tenantWhere(tenantId, {});

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          slug: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          code: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ];
    }

    return where;
  }

  private async ensureProjectExists(tenantId: string, projectId: string): Promise<void> {
    const existingProject = await this.prisma.project.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, { id: projectId }),
      select: {
        id: true
      }
    });

    if (!existingProject) {
      throw new NotFoundException(`Project ${projectId} was not found.`);
    }
  }

  private handleProjectWriteError(error: unknown, slug: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException(`A project with slug ${slug} already exists in this tenant.`);
    }

    throw error;
  }
}
