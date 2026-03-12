import { Injectable, NotImplementedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateManuscriptDto } from "./dto/create-manuscript.dto";
import { CreateManuscriptVersionDto } from "./dto/create-manuscript-version.dto";
import { UpdateManuscriptSectionDto } from "./dto/update-manuscript-section.dto";

@Injectable()
export class ManuscriptsService {
  constructor(private readonly prisma: PrismaService) {}

  createManuscript(tenantId: string, projectId: string, actorUserId: string, payload: CreateManuscriptDto): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId });
    void actorUserId;
    void payload;
    throw new NotImplementedException("Manuscript creation is not implemented yet.");
  }

  createVersion(
    tenantId: string,
    projectId: string,
    manuscriptId: string,
    actorUserId: string,
    payload: CreateManuscriptVersionDto
  ): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: manuscriptId });
    void actorUserId;
    void payload;
    throw new NotImplementedException("Manuscript version creation is not implemented yet.");
  }

  updateSection(
    tenantId: string,
    projectId: string,
    manuscriptVersionId: string,
    sectionId: string,
    payload: UpdateManuscriptSectionDto
  ): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: manuscriptVersionId });
    void sectionId;
    void payload;
    throw new NotImplementedException("Manuscript section update is not implemented yet.");
  }

  listVersions(tenantId: string, projectId: string, manuscriptId: string): never {
    void this.prisma.buildTenantWhere(tenantId, { projectId, id: manuscriptId });
    throw new NotImplementedException("Manuscript version listing is not implemented yet.");
  }
}
