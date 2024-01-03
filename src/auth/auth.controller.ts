import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  LoginUserDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('verify-otp')
  validateOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.validateOTP(verifyOtpDto);
  }
  @Get('resend-otp/:{otpRef}')
  resendOtp(@Param('otpRef') otpRef: string) {
    return this.authService.resendOTP(otpRef);
  }
}
