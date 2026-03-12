import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { AccessOutcome } from "@prisma/client";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AuditService } from "../../audit/audit.service";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        void this.auditService.recordHttpInteraction({
          method: request.method,
          path: request.url,
          actorUserId: request.user?.userId,
          tenantId: request.params["tenantId"] ?? request.headers["x-tenant-id"],
          outcome: AccessOutcome.ALLOWED
        });
      }),
      catchError((error: unknown) => {
        void this.auditService.recordHttpInteraction({
          method: request.method,
          path: request.url,
          actorUserId: request.user?.userId,
          tenantId: request.params["tenantId"] ?? request.headers["x-tenant-id"],
          outcome: AccessOutcome.DENIED,
          errorName: error instanceof Error ? error.name : "UnknownError"
        });
        return throwError(() => error);
      })
    );
  }
}
