import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTeacherDto {
    @ApiProperty()
    @IsNotEmpty()
    teacherName: string;

    @ApiProperty()
    @IsNotEmpty()
    teacherEmail: string;

    @ApiProperty()
    @IsNotEmpty()
    favoriteStudent: string;

    @ApiProperty()
    @IsNotEmpty()
    subject: string;
}
