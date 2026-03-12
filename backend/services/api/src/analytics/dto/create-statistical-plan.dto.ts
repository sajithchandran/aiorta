import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsString } from "class-validator";

export class CreateStatisticalPlanDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ type: "object", additionalProperties: true })
  @IsObject()
  planJson!: Record<string, unknown>;
}
