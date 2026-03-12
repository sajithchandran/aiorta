import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { NextFunction, Request, Response } from "express";
import {
  REQUEST_ID_HEADER_KEY,
  TENANT_HEADER_KEY
} from "../constants/app.constants";
import { PlatformRole } from "../enums/platform-role.enum";
import { RequestContextService } from "./request-context.service";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  use(request: Request, _response: Response, next: NextFunction): void {
    const requestId = String(request.headers[REQUEST_ID_HEADER_KEY] ?? randomUUID());
    const tenantId = this.readTenantId(request);

    const user = request.user as
      | {
          userId?: string;
          email?: string;
          platformRole?: PlatformRole;
        }
      | undefined;

    this.requestContextService.run(
      {
        requestId,
        tenantId,
        userId: user?.userId,
        email: user?.email,
        platformRole: user?.platformRole
      },
      () => next()
    );
  }

  private readTenantId(request: Request): string | undefined {
    const routeTenantId = request.params["tenantId"];
    const headerTenantId = request.headers[TENANT_HEADER_KEY];

    if (typeof routeTenantId === "string" && routeTenantId.length > 0) {
      return routeTenantId;
    }

    if (typeof headerTenantId === "string" && headerTenantId.length > 0) {
      return headerTenantId;
    }

    return undefined;
  }
}
