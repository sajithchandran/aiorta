import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, StudyDocument } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { QueryDocumentsDto } from "./dto/query-documents.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  async createDocument(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateDocumentDto
  ): Promise<StudyDocument> {
    try {
      return await this.prisma.studyDocument.create({
        data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
          projectId,
          documentType: payload.documentType,
          title: payload.title,
          storagePath: payload.storagePath,
          mimeType: payload.mimeType,
          fileSizeBytes:
            typeof payload.fileSizeBytes === "number" ? BigInt(payload.fileSizeBytes) : undefined,
          checksum: payload.checksum,
          metadataJson: payload.metadataJson as Prisma.InputJsonValue | undefined
        })
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          `A document with storage path ${payload.storagePath} already exists in this project.`
        );
      }

      throw error;
    }
  }

  async listDocuments(tenantId: string, projectId: string, query: QueryDocumentsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where = this.buildWhere(tenantId, projectId, query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.studyDocument.findMany({
        where,
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: pageSize
      }),
      this.prisma.studyDocument.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async getDocumentById(
    tenantId: string,
    projectId: string,
    documentId: string
  ): Promise<StudyDocument> {
    const document = await this.prisma.studyDocument.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        id: documentId,
        projectId
      })
    });

    if (!document) {
      throw new NotFoundException(`Document ${documentId} was not found.`);
    }

    return document;
  }

  async updateDocument(
    tenantId: string,
    projectId: string,
    documentId: string,
    payload: UpdateDocumentDto
  ): Promise<StudyDocument> {
    await this.getDocumentById(tenantId, projectId, documentId);

    return this.prisma.studyDocument.update({
      where: { id: documentId },
      data: {
        ...payload,
        fileSizeBytes:
          typeof payload.fileSizeBytes === "number" ? BigInt(payload.fileSizeBytes) : undefined,
        metadataJson: payload.metadataJson as Prisma.InputJsonValue | undefined
      }
    });
  }

  private buildWhere(
    tenantId: string,
    projectId: string,
    query: QueryDocumentsDto
  ): Prisma.StudyDocumentWhereInput {
    const where: Prisma.StudyDocumentWhereInput = this.tenantPrisma.tenantWhere(tenantId, {
      projectId
    });

    if (query.documentType) {
      where.documentType = query.documentType;
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
          storagePath: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ];
    }

    return where;
  }
}
