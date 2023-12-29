import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSubjectDto {
  @ApiProperty()
  @IsNotEmpty()
  subjectName: string;
}
