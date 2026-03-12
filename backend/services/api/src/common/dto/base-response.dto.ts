import { ApiProperty } from "@nestjs/swagger";

export class BaseResponseDto<TData> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty()
  data!: TData;

  @ApiProperty({ required: false, nullable: true })
  message?: string | null;
}
