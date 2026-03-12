import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QueryTenantsDto } from "./dto/query-tenants.dto";
import { TenantsService } from "./tenants.service";

@ApiTags("tenants")
@Controller("tenants")
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  listTenants(@Query() query: QueryTenantsDto) {
    return this.tenantsService.listTenants(query);
  }
}
