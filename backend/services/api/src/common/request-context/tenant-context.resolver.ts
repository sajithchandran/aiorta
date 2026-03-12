import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { TENANT_HEADER_KEY } from "../constants/app.constants";
import { MissingTenantContextException } from "../errors/missing-tenant-context.exception";

@Injectable()
export class TenantContextResolver {
  resolveTenantId(request: Request, options?: { required?: boolean }): string | undefined {
    const routeTenantId = request.params["tenantId"];
    const headerTenantId = request.headers[TENANT_HEADER_KEY];
    const headerValue = typeof headerTenantId === "string" ? headerTenantId : undefined;

    if (routeTenantId && headerValue && routeTenantId !== headerValue) {
      throw new MissingTenantContextException();
    }

    const resolvedTenantId = routeTenantId ?? headerValue;

    if (!resolvedTenantId && options?.required) {
      throw new MissingTenantContextException();
    }

    return resolvedTenantId;
  }
}
