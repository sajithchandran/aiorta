import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateManuscriptDto {
  @ApiProperty()
  @IsString()
  title!: string;
}
