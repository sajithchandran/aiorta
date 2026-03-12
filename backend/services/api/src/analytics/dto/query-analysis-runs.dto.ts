import { ApiPropertyOptional } from "@nestjs/swagger";
import { AnalysisRunStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class QueryAnalysisRunsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: AnalysisRunStatus })
  @IsOptional()
  @IsEnum(AnalysisRunStatus)
  status?: AnalysisRunStatus;
}
