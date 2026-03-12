import { PlatformRole } from "../enums/platform-role.enum";

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      platformRole: PlatformRole;
    }

    interface Request {
      tenantId?: string;
    }
  }
}

export {};
