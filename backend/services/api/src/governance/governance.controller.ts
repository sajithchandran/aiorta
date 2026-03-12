import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("governance")
@Controller("governance")
export class GovernanceController {}
