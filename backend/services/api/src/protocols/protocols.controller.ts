import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("protocols")
@Controller("protocols")
export class ProtocolsController {}
