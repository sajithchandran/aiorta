import { Injectable } from "@nestjs/common";

@Injectable()
export class TenantPrismaService {
  tenantWhere<TWhere extends object>(
    tenantId: string,
    where: TWhere = {} as TWhere
  ): TWhere & { tenantId: string; deletedAt: null } {
    return {
      ...where,
      tenantId,
      deletedAt: null
    };
  }

  tenantCreateData<TData extends object>(
    tenantId: string,
    actorUserId: string,
    data: TData
  ): TData & { tenantId: string; createdById: string } {
    return {
      ...data,
      tenantId,
      createdById: actorUserId
    };
  }
}
