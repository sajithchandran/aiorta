import { ApiPropertyOptional } from "@nestjs/swagger";
import { SignatureStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class QuerySignaturesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: SignatureStatus })
  @IsOptional()
  @IsEnum(SignatureStatus)
  status?: SignatureStatus;
}
