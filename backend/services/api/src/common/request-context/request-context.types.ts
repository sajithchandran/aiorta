import { PlatformRole } from "../enums/platform-role.enum";

export interface RequestContextState {
  requestId: string;
  userId?: string;
  email?: string;
  tenantId?: string;
  platformRole?: PlatformRole;
  projectId?: string;
}
