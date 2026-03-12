import { Injectable, NotImplementedException } from "@nestjs/common";
import { QueryTenantsDto } from "./dto/query-tenants.dto";

@Injectable()
export class TenantsService {
  listTenants(_query: QueryTenantsDto): never {
    throw new NotImplementedException("Tenant queries are not implemented yet.");
  }
}
