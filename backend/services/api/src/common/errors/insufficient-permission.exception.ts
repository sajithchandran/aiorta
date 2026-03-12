import { ForbiddenException } from "@nestjs/common";

export class InsufficientPermissionException extends ForbiddenException {
  constructor(permissionKeys: string[]) {
    super(`Missing required permissions: ${permissionKeys.join(", ")}`);
  }
}
