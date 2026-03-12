import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentTenant = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined => {
    const request = context.switchToHttp().getRequest();
    const headerTenantId = request.headers["x-tenant-id"];

    return (
      request.params["tenantId"] ??
      (typeof headerTenantId === "string" ? headerTenantId : undefined) ??
      request.tenantId
    );
  }
);
