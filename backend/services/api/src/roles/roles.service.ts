import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class RolesService {
  listRoles(): never {
    throw new NotImplementedException("Role queries are not implemented yet.");
  }
}
