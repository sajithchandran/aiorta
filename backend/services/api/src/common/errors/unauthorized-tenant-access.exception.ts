import { ForbiddenException } from "@nestjs/common";

export class UnauthorizedTenantAccessException extends ForbiddenException {
  constructor(tenantId: string) {
    super(`You do not have access to tenant ${tenantId}.`);
  }
}
