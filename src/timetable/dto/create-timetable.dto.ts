import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTimetableDto {
    @ApiProperty()
    @IsNotEmpty()
    day: string;

    @ApiProperty()
    @IsNotEmpty()
    teacherId: string;

    @ApiProperty()
    @IsNotEmpty()
    classId: string;
    
}
