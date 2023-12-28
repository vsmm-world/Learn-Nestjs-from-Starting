import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateClassDto {
    @ApiProperty()
    @IsNotEmpty()
    className: string;
}
