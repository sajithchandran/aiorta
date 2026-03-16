import { ApiPropertyOptional } from "@nestjs/swagger";
import { DatasetStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class QueryDatasetsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: DatasetStatus })
  @IsOptional()
  @IsEnum(DatasetStatus)
  status?: DatasetStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
