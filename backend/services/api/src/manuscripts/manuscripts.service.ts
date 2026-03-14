import { Injectable, NotFoundException } from "@nestjs/common";
import { ManuscriptSectionType, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateManuscriptDto } from "./dto/create-manuscript.dto";
import { CreateManuscriptVersionDto } from "./dto/create-manuscript-version.dto";
import { UpdateManuscriptSectionDto } from "./dto/update-manuscript-section.dto";

@Injectable()
export class ManuscriptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  async createManuscript(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateManuscriptDto
  ) {
    return this.prisma.manuscript.create({
      data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
        projectId,
        title: payload.title
      })
    });
  }

  async createVersion(
    tenantId: string,
    projectId: string,
    manuscriptId: string,
    actorUserId: string,
    payload: CreateManuscriptVersionDto
  ) {
    await this.ensureManuscriptExists(tenantId, projectId, manuscriptId);

    const latestVersion = await this.prisma.manuscriptVersion.findFirst({
      where: {
        tenantId,
        manuscriptId,
        deletedAt: null
      },
      orderBy: {
        versionNumber: "desc"
      },
      select: {
        versionNumber: true
      }
    });

    return this.prisma.$transaction(async (tx) => {
      const version = await tx.manuscriptVersion.create({
        data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
          manuscriptId,
          versionNumber: (latestVersion?.versionNumber ?? 0) + 1,
          changeSummary: payload.changeSummary,
          outlineJson: payload.outlineJson as Prisma.InputJsonValue | undefined
        })
      });

      const sectionTypes: ManuscriptSectionType[] = [
        ManuscriptSectionType.TITLE,
        ManuscriptSectionType.ABSTRACT,
        ManuscriptSectionType.INTRODUCTION,
        ManuscriptSectionType.METHODS,
        ManuscriptSectionType.RESULTS,
        ManuscriptSectionType.DISCUSSION,
        ManuscriptSectionType.REFERENCES
      ];

      await tx.manuscriptSection.createMany({
        data: sectionTypes.map((sectionType, index) => ({
          tenantId,
          createdById: actorUserId,
          manuscriptVersionId: version.id,
          sectionType,
          sortOrder: index
        }))
      });

      return tx.manuscriptVersion.findUniqueOrThrow({
        where: { id: version.id },
        include: { sections: true }
      });
    });
  }

  async updateSection(
    tenantId: string,
    projectId: string,
    manuscriptVersionId: string,
    sectionId: string,
    payload: UpdateManuscriptSectionDto
  ) {
    const section = await this.prisma.manuscriptSection.findFirst({
      where: {
        tenantId,
        id: sectionId,
        deletedAt: null,
        manuscriptVersionId,
        manuscriptVersion: {
          manuscript: {
            tenantId,
            projectId,
            deletedAt: null
          }
        }
      }
    });

    if (!section) {
      throw new NotFoundException(`Manuscript section ${sectionId} was not found.`);
    }

    return this.prisma.manuscriptSection.update({
      where: {
        id: sectionId
      },
      data: {
        title: payload.title,
        content: payload.content,
        sourceSummaryJson: payload.sourceSummaryJson as Prisma.InputJsonValue | undefined
      }
    });
  }

  async listVersions(tenantId: string, projectId: string, manuscriptId: string) {
    await this.ensureManuscriptExists(tenantId, projectId, manuscriptId);

    return this.prisma.manuscriptVersion.findMany({
      where: {
        tenantId,
        manuscriptId,
        deletedAt: null
      },
      include: {
        sections: {
          where: {
            deletedAt: null
          },
          orderBy: {
            sortOrder: "asc"
          }
        }
      },
      orderBy: {
        versionNumber: "desc"
      }
    });
  }

  private async ensureManuscriptExists(
    tenantId: string,
    projectId: string,
    manuscriptId: string
  ): Promise<void> {
    const manuscript = await this.prisma.manuscript.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        projectId,
        id: manuscriptId
      }),
      select: { id: true }
    });

    if (!manuscript) {
      throw new NotFoundException(`Manuscript ${manuscriptId} was not found.`);
    }
  }
}
