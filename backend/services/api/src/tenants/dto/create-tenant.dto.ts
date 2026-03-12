import { ApiProperty } from "@nestjs/swagger";
import { TenantType } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class CreateTenantDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty({ enum: TenantType })
  @IsEnum(TenantType)
  type!: TenantType;
}
