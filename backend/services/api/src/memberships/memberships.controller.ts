import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("memberships")
@Controller("memberships")
export class MembershipsController {}
