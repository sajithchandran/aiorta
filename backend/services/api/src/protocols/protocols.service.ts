import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ApprovalStatus, Prisma, Protocol } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { TenantPrismaService } from "../prisma/tenant-prisma.service";
import { CreateProtocolDto } from "./dto/create-protocol.dto";
import { QueryProtocolsDto } from "./dto/query-protocols.dto";
import { UpdateProtocolDto } from "./dto/update-protocol.dto";

@Injectable()
export class ProtocolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService
  ) {}

  async createProtocol(
    tenantId: string,
    projectId: string,
    actorUserId: string,
    payload: CreateProtocolDto
  ): Promise<Protocol> {
    try {
      return await this.prisma.protocol.create({
        data: this.tenantPrisma.tenantCreateData(tenantId, actorUserId, {
          projectId,
          version: payload.version,
          title: payload.title,
          synopsis: payload.synopsis,
          status: payload.status ?? ApprovalStatus.PENDING,
          documentPath: payload.documentPath,
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
          `Protocol version ${payload.version} already exists for project ${projectId}.`
        );
      }

      throw error;
    }
  }

  async listProtocols(tenantId: string, projectId: string, query: QueryProtocolsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where = this.buildWhere(tenantId, projectId, query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.protocol.findMany({
        where,
        orderBy: {
          version: "desc"
        },
        skip,
        take: pageSize
      }),
      this.prisma.protocol.count({ where })
    ]);

    return { success: true, items, page, pageSize, total };
  }

  async getProtocolById(tenantId: string, projectId: string, protocolId: string): Promise<Protocol> {
    const protocol = await this.prisma.protocol.findFirst({
      where: this.tenantPrisma.tenantWhere(tenantId, {
        id: protocolId,
        projectId
      })
    });

    if (!protocol) {
      throw new NotFoundException(`Protocol ${protocolId} was not found.`);
    }

    return protocol;
  }

  async updateProtocol(
    tenantId: string,
    projectId: string,
    protocolId: string,
    payload: UpdateProtocolDto
  ): Promise<Protocol> {
    await this.getProtocolById(tenantId, projectId, protocolId);

    return this.prisma.protocol.update({
      where: { id: protocolId },
      data: {
        ...payload,
        metadataJson: payload.metadataJson as Prisma.InputJsonValue | undefined
      }
    });
  }

  private buildWhere(
    tenantId: string,
    projectId: string,
    query: QueryProtocolsDto
  ): Prisma.ProtocolWhereInput {
    const where: Prisma.ProtocolWhereInput = this.tenantPrisma.tenantWhere(tenantId, {
      projectId
    });

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
          synopsis: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ];
    }

    return where;
  }
}
