import { SetMetadata } from "@nestjs/common";
import { PERMISSIONS_KEY } from "../constants/app.constants";
import { PermissionKey } from "../enums/permission-key.enum";

export const Permissions = (...permissions: PermissionKey[]): MethodDecorator & ClassDecorator =>
  SetMetadata(PERMISSIONS_KEY, permissions);
