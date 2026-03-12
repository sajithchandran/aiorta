import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AIJobType } from "@prisma/client";
import { IsEnum, IsObject, IsOptional, IsUUID } from "class-validator";

export class CreateAiJobDto {
  @ApiProperty({ enum: AIJobType })
  @IsEnum(AIJobType)
  jobType!: AIJobType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  datasetVersionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  analysisRunId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  manuscriptId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  manuscriptVersionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  manuscriptSectionId?: string;

  @ApiPropertyOptional({ type: "object", additionalProperties: true })
  @IsOptional()
  @IsObject()
  inputBundleJson?: Record<string, unknown>;
}
