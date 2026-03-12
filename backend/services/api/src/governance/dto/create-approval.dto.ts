import { ApiProperty } from "@nestjs/swagger";
import { ApprovalTargetType } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";

export class CreateApprovalDto {
  @ApiProperty({ enum: ApprovalTargetType })
  @IsEnum(ApprovalTargetType)
  targetType!: ApprovalTargetType;

  @ApiProperty()
  @IsUUID()
  targetId!: string;
}
