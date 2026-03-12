import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CohortRuleNodeType, ComparisonOperator, LogicalOperator } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCohortRuleDto {
  @ApiProperty({ enum: CohortRuleNodeType })
  @IsEnum(CohortRuleNodeType)
  nodeType!: CohortRuleNodeType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentRuleId?: string;

  @ApiPropertyOptional({ enum: LogicalOperator })
  @IsOptional()
  @IsEnum(LogicalOperator)
  logicalOperator?: LogicalOperator;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fieldKey?: string;

  @ApiPropertyOptional({ enum: ComparisonOperator })
  @IsOptional()
  @IsEnum(ComparisonOperator)
  operator?: ComparisonOperator;
}
