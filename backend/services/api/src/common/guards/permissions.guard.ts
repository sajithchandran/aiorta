import {
  CanActivate,
  ExecutionContext,
  Injectable
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";
import { PERMISSIONS_KEY } from "../constants/app.constants";
import { PermissionKey } from "../enums/permission-key.enum";
import { PlatformRole } from "../enums/platform-role.enum";
import { InsufficientPermissionException } from "../errors/insufficient-permission.exception";
import { RequestContextService } from "../request-context/request-context.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly requestContextService: RequestContextService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions =
      this.reflector.getAllAndOverride<PermissionKey[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass()
      ]) ?? [];

    if (permissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as
      | {
          userId: string;
          platformRole: PlatformRole;
        }
      | undefined;
    const tenantId = request.tenantId ?? request.params["tenantId"];
    const projectId = request.params["projectId"];

    if (!user) {
      throw new InsufficientPermissionException(permissions);
    }

    if (user.platformRole === PlatformRole.PLATFORM_ADMIN) {
      return true;
    }

    const matchedPermissions = new Set<string>();

    if (tenantId) {
      const tenantPermissions = await this.prisma.rolePermission.findMany({
        where: {
          deletedAt: null,
          role: {
            tenantMembers: {
              some: {
                tenantId,
                userId: user.userId,
                status: "ACTIVE",
                deletedAt: null
              }
            }
          },
          permission: {
            key: {
              in: permissions
            },
            deletedAt: null
          }
        },
        select: {
          permission: {
            select: {
              key: true
            }
          }
        }
      });

      tenantPermissions.forEach((entry) => matchedPermissions.add(entry.permission.key));
    }

    if (projectId) {
      const projectPermissions = await this.prisma.rolePermission.findMany({
        where: {
          deletedAt: null,
          role: {
            projectMembers: {
              some: {
                projectId,
                userId: user.userId,
                deletedAt: null
              }
            }
          },
          permission: {
            key: {
              in: permissions
            },
            deletedAt: null
          }
        },
        select: {
          permission: {
            select: {
              key: true
            }
          }
        }
      });

      projectPermissions.forEach((entry) => matchedPermissions.add(entry.permission.key));
    }

    const hasAllPermissions = permissions.every((permission) => matchedPermissions.has(permission));

    if (!hasAllPermissions) {
      throw new InsufficientPermissionException(permissions);
    }

    this.requestContextService.set({
      tenantId,
      projectId
    });

    return true;
  }
}
