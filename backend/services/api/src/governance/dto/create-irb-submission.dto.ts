import { ApiPropertyOptional } from "@nestjs/swagger";
import { IRBSubmissionStatus } from "@prisma/client";
import { IsEnum, IsObject, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateIrbSubmissionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  protocolId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({ enum: IRBSubmissionStatus })
  @IsOptional()
  @IsEnum(IRBSubmissionStatus)
  status?: IRBSubmissionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  submissionJson?: Record<string, unknown>;
}
