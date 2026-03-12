import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";

export class CreateManuscriptVersionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changeSummary?: string;

  @ApiPropertyOptional({ type: "object", additionalProperties: true })
  @IsOptional()
  @IsObject()
  outlineJson?: Record<string, unknown>;
}
