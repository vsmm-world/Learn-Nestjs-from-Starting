import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateAuthDto,
  LoginUserDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { env } from 'process';
import * as postmark from 'postmark';
import * as otpGenerator from 'otp-generator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async logout(req: any) {
    return await this.prisma.userSession
      .findFirst({
        where: {
          token: req.headers.authorization,
          expiresAt: { gte: new Date(Date.now()) },
        },
      })
      .then(async (res) => {
        return await this.prisma.userSession
          .update({
            where: { id: res.id },
            data: { expiresAt: new Date(Date.now()) },
          })
          .then((res) => {
            return {
              statusCode: HttpStatus.OK,
              message: 'Logged out successfully',
            };
          })
          .catch((err) => {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: "Couldn't logout",
            };
          });
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't logout",
        };
      });
  }
  async login(loginUserDto: LoginUserDto) {
    return this.prisma.user
      .findFirst({
        where: { email: loginUserDto.email, isDeleted: false },
      })
      .then(async (user) => {
        if (user) {
          const match = bcrypt.compare(loginUserDto.password, user.password);
          if (match) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpRef = otpGenerator.generate(6, {
              upperCase: false,
              specialChars: false,
              alphabets: false,
            });
            await this.prisma.tempOTP
              .create({
                data: {
                  otp,
                  otpRef,
                  expiresAt: new Date(Date.now() + 300000),
                  user: { connect: { id: user.id } },
                },
              })
              .then((res) => {})
              .catch((err) => {
                return {
                  statusCode: HttpStatus.BAD_REQUEST,
                  message: "Couldn't create OTP",
                };
              });

            const mail = {
              TemplateId: 34277244,

              TemplateModel: {
                otp: otp,
              },
              From: 'rushi@syscreations.com',
              To: user.email,
              Subject: 'Your OTP for Verification',
              TemplateVariables: {
                otp: otp,
              },
              TextBody: `${otp}`,
              HtmlBody: `${otp} ${otpRef}`,
            };
            const client = new postmark.ServerClient(env.POST_MARK_API_KEY);
            return await client
              .sendEmail(mail)
              .then((res) => {
                return {
                  statusCode: HttpStatus.OK,
                  message: 'OTP is sent successfully',
                  otpRef,
                };
              })
              .catch((err) => {
                return {
                  statusCode: HttpStatus.BAD_REQUEST,
                  message: 'OTP is not sent, Error !',
                };
              });
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid password',
            };
          }
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid email',
          };
        }
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't login",
        };
      });
  }
  async validateOTP(verifyOtpDto: VerifyOtpDto) {
    const { otp, otpRef } = verifyOtpDto;
    console.log(otp, otpRef);
    return await this.prisma.tempOTP
      .findFirst({
        where: { otpRef, expiresAt: { gte: new Date(Date.now()) } },
      })
      .then(async (res) => {
        if (res.otp == otp) {
          const session = await this.prisma.userSession.create({
            data: {
              user: { connect: { id: res.userId } },
              tempOTP: { connect: { id: res.id } },
              token: 'xyz',
            },
          });
          const user = await this.prisma.user.findFirst({
            where: { id: res.userId },
          });
          const token = this.generatejwtToken(user.id);
          const accesToken = await this.prisma.userSession.update({
            where: { id: session.id },
            data: { token, expiresAt: new Date(Date.now() + 86400000) },
          });

          return {
            statusCode: HttpStatus.OK,
            message: 'OTP is valid',
            accesToken,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'OTP is invalid',
          };
        }
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: err,
        };
      });
  }

  generatejwtToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async resendOTP(otpRef: string) {
    return await this.prisma.tempOTP
      .findFirst({
        where: { otpRef, expiresAt: { gte: new Date(Date.now()) } },
      })
      .then(async (res) => {
        const user = await this.prisma.user.findFirst({
          where: { id: res.userId },
        });

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpRef = otpGenerator.generate(6, {
          upperCase: false,
          specialChars: false,
          alphabets: false,
        });
        await this.prisma.tempOTP.update({
          where: { id: res.id },
          data: { otp, expiresAt: new Date(Date.now() + 120000) },
        });

        const mail = {
          TemplateId: 34277244,

          TemplateModel: {
            otp: otp,
          },
          From: 'rushi@syscreations.com',
          To: user.email,
          Subject: 'New OTP for Verification',
          TemplateVariables: {
            otp: otp,
          },
          TextBody: `  `,
          HtmlBody: `${otp} ${otpRef}}`,
        };

        const client = new postmark.ServerClient(env.POST_MARK_API_KEY);
        return await client
          .sendEmail(mail)
          .then((res) => {
            return {
              statusCode: HttpStatus.OK,
              message: 'OTP is sent successfully',
            };
          })
          .catch((err) => {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: err,
            };
          });
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: err,
        };
      });
  }
}
