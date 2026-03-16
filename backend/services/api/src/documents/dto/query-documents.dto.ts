import { ApiPropertyOptional } from "@nestjs/swagger";
import { DocumentType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class QueryDocumentsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
