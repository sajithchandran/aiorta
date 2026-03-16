import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ApprovalStatus } from "@prisma/client";
import { IsEnum, IsInt, IsObject, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateProtocolDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  version!: number;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiPropertyOptional({ enum: ApprovalStatus })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  status?: ApprovalStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentPath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checksum?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadataJson?: Record<string, unknown>;
}
