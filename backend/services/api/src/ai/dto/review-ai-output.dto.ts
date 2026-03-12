import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AIReviewDecision } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ReviewAiOutputDto {
  @ApiProperty({ enum: AIReviewDecision })
  @IsEnum(AIReviewDecision)
  decision!: AIReviewDecision;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;
}
