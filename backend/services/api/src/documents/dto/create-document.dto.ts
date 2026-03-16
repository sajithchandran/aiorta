import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DocumentType } from "@prisma/client";
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min
} from "class-validator";

export class CreateDocumentDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType!: DocumentType;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty()
  @IsString()
  storagePath!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  fileSizeBytes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checksum?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadataJson?: Record<string, unknown>;
}
