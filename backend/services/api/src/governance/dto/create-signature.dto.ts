import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SignatureStatus } from "@prisma/client";
import { IsEnum, IsObject, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSignatureDto {
  @ApiProperty()
  @IsUUID()
  signerId!: string;

  @ApiPropertyOptional({ enum: SignatureStatus })
  @IsOptional()
  @IsEnum(SignatureStatus)
  status?: SignatureStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  signatureHash?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadataJson?: Record<string, unknown>;
}
