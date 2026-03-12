import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class MembershipsService {
  listMemberships(): never {
    throw new NotImplementedException("Membership queries are not implemented yet.");
  }
}
