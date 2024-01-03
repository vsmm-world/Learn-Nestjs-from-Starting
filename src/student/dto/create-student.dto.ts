import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { CustomEmailValidator, PasswordValidator } from "src/validator/custom.validator";

export class CreateStudentDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @Validate(CustomEmailValidator, { message: 'Invalid email format, e.g.(test@example.com)' })
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @Validate(PasswordValidator, { message: 'Password is not Strong enough' })
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    classID: string;
}
