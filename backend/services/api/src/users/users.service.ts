import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class UsersService {
  listUsers(): never {
    throw new NotImplementedException("Users queries are not implemented yet.");
  }
}
