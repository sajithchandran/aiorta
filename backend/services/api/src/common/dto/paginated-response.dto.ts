import { ApiProperty } from "@nestjs/swagger";

export class PaginatedResponseDto<TData> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty()
  items!: TData[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  total!: number;
}
