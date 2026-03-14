import { ApiPropertyOptional } from "@nestjs/swagger";
import { IRBSubmissionStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class QueryIrbSubmissionsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: IRBSubmissionStatus })
  @IsOptional()
  @IsEnum(IRBSubmissionStatus)
  status?: IRBSubmissionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
