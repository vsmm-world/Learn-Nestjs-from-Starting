import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAttendanceDto {
    @ApiProperty()
    @IsNotEmpty()
    classid: string;

    @ApiProperty()
    @IsNotEmpty()
    studentid: string;

    @ApiProperty()
    @IsNotEmpty()
    present: boolean;

    @ApiProperty()
    @IsNotEmpty()
    date: string;
    
}
