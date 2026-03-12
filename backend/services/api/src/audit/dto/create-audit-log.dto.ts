import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateAuditLogDto {
  @ApiProperty()
  @IsString()
  resourceType!: string;

  @ApiProperty()
  @IsUUID()
  resourceId!: string;
}
