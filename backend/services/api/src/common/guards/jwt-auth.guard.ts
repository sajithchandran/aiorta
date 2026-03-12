import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { AUTH_PUBLIC_KEY } from "../constants/app.constants";
import { RequestContextService } from "../request-context/request-context.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestContextService: RequestContextService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(AUTH_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      this.requestContextService.set({
        userId: request.user.userId,
        email: request.user.email,
        platformRole: request.user.platformRole
      });
    }

    return Boolean(canActivate);
  }
}
