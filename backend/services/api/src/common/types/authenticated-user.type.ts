import { PlatformRole } from "../enums/platform-role.enum";

export interface AuthenticatedUser {
  readonly userId: string;
  readonly email: string;
  readonly platformRole: PlatformRole;
}
