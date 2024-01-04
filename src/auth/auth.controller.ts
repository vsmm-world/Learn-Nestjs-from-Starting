import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  LoginUserDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentication')
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
  @Post('resend-otp/:otpRef')
  resendOtp(@Param('otpRef') otpRef: string) {
    return this.authService.resendOTP(otpRef);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('whoami')
  async whoami(@Request() req) {
    return req.user;
  }
}
