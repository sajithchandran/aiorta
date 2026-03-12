import { Injectable, NotImplementedException } from "@nestjs/common";
import { AccessAction, AccessOutcome, AuditOutcome } from "@prisma/client";
import { RequestContextService } from "../common/request-context/request-context.service";
import { PrismaService } from "../prisma/prisma.service";
import { QueryAuditLogsDto } from "./dto/query-audit-logs.dto";

interface AuditHttpInteraction {
  readonly method: string;
  readonly path: string;
  readonly actorUserId?: string;
  readonly tenantId?: string;
  readonly outcome: AccessOutcome;
  readonly errorName?: string;
}

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContextService: RequestContextService
  ) {}

  async recordHttpInteraction(payload: AuditHttpInteraction): Promise<void> {
    const context = this.requestContextService.get();
    const tenantId = payload.tenantId ?? context.tenantId;
    const actorUserId = payload.actorUserId ?? context.userId;

    if (!tenantId || !actorUserId) {
      return;
    }

    const isWrite = ["POST", "PATCH", "PUT", "DELETE"].includes(payload.method.toUpperCase());

    await this.prisma.accessLog.create({
      data: {
        tenantId,
        createdById: actorUserId,
        actorUserId,
        action: isWrite ? AccessAction.API_WRITE : AccessAction.API_READ,
        outcome: payload.outcome,
        resourceType: "HTTP_ROUTE",
        requestId: context.requestId,
        metadataJson: {
          method: payload.method,
          path: payload.path,
          errorName: payload.errorName ?? null
        }
      }
    });

    if (isWrite) {
      await this.prisma.auditLog.create({
        data: {
          tenantId,
          createdById: actorUserId,
          actorUserId,
          action: payload.method.toUpperCase(),
          outcome:
            payload.outcome === AccessOutcome.ALLOWED
              ? AuditOutcome.SUCCESS
              : AuditOutcome.FAILURE,
          resourceType: "HTTP_ROUTE",
          requestId: context.requestId,
          metadataJson: {
            path: payload.path,
            errorName: payload.errorName ?? null
          }
        }
      });
    }
  }

  listAuditLogs(_tenantId: string, _query: QueryAuditLogsDto): never {
    throw new NotImplementedException("Audit log queries are not implemented yet.");
  }

  listAccessLogs(_tenantId: string, _query: QueryAuditLogsDto): never {
    throw new NotImplementedException("Access log queries are not implemented yet.");
  }
}
