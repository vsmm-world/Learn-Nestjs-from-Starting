import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class getTeacherDTO {
    @ApiProperty()
    @IsNotEmpty()
    ClassId: string;

    @ApiProperty()
    @IsNotEmpty()
    Day: string;
}

export class getAttandanceDTO{
    @ApiProperty()
    @IsNotEmpty()
    ClassId: string;

    @ApiProperty()
    @IsNotEmpty()
    Date: string;
}
