import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional, IsUUID } from "class-validator";

export class CreateAnalysisRunDto {
  @ApiProperty()
  @IsUUID()
  datasetVersionId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  statisticalPlanId?: string;

  @ApiPropertyOptional({ type: "object", additionalProperties: true })
  @IsOptional()
  @IsObject()
  parametersJson?: Record<string, unknown>;
}
