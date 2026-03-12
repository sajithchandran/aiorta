import { PlatformRole } from "../../common/enums/platform-role.enum";

export interface JwtPayload {
  readonly userId: string;
  readonly email: string;
  readonly platformRole: PlatformRole;
}
