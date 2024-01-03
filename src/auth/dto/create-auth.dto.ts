import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { CustomEmailValidator, PasswordValidator } from "src/validator/custom.validator";

export class CreateAuthDto {}
export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(CustomEmailValidator, {
    message: 'Invalid email format, e.g.(test@example.com)',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(PasswordValidator, { message: 'Password is not Strong enough' })
  password: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  otp: number;

  @ApiProperty()
  @IsNotEmpty()
  otpRef: string;
}
