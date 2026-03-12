import {
  CanActivate,
  ExecutionContext,
  Injectable
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PlatformRole } from "../enums/platform-role.enum";
import { MissingTenantContextException } from "../errors/missing-tenant-context.exception";
import { UnauthorizedTenantAccessException } from "../errors/unauthorized-tenant-access.exception";
import { RequestContextService } from "../request-context/request-context.service";
import { TenantContextResolver } from "../request-context/tenant-context.resolver";

@Injectable()
export class TenantMembershipGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContextService: RequestContextService,
    private readonly tenantContextResolver: TenantContextResolver
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = this.tenantContextResolver.resolveTenantId(request, {
      required: true
    });
    const user = request.user as { userId: string; platformRole: PlatformRole } | undefined;

    if (!tenantId) {
      throw new MissingTenantContextException();
    }

    request.tenantId = tenantId;
    this.requestContextService.set({
      tenantId,
      projectId: request.params["projectId"]
    });

    if (!user) {
      throw new UnauthorizedTenantAccessException(tenantId);
    }

    if (user.platformRole === PlatformRole.PLATFORM_ADMIN) {
      return true;
    }

    const membership = await this.prisma.tenantMembership.findFirst({
      where: {
        tenantId,
        userId: user.userId,
        status: "ACTIVE",
        deletedAt: null
      },
      select: {
        id: true
      }
    });

    if (!membership) {
      throw new UnauthorizedTenantAccessException(tenantId);
    }

    return true;
  }
}
