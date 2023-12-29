import { HttpStatus, Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
import {
  CreateUserDto,
  LoginUserDto,
  VerifyOtpDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as otpGenerator from 'otp-generator';
import * as bcrypt from 'bcrypt';
import { env } from 'process';

let objid;

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  test(id: string) {
    return this.prisma.userSession.findFirst({
      where: { token: id, expiresAt: { gte: new Date(Date.now()) } },
    });
  }

  async whoAmI(id: string) {
    return await this.prisma.userSession
      .findFirst({
        where: { token: id, expiresAt: { gte: new Date(Date.now()) } },
      })
      .then(async (res) => {
        const session = res;
        const user = await this.prisma.user.findFirst({
          where: { id: res.userId },
        });
        return {
          statusCode: HttpStatus.OK,
          message: 'User found',
          user,
          session,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't find user",
        };
      });
  }

  async logout(id: string) {
    return await this.prisma.userSession
      .update({
        where: { id },
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
  }

  login(loginUserDto: LoginUserDto) {
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

            const session = await this.prisma.userSession.create({
              data: {
                token: 'xyz',
                user: { connect: { id: user.id } },
              },
            });

            await this.prisma.tempOTP
              .create({
                data: {
                  otp,
                  otpRef,
                  UserSession: { connect: { id: session.id } },
                  expiresAt: new Date(Date.now() + 120000),
                },
              })
              .then((res) => {
                objid = res.id;
              })
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

            // {
            //   "Name": "Onboarding Email",
            //   "Subject": "Hello from {{company.name}}!",
            //   "TextBody": "Hello, {{name}}!",
            //   "HtmlBody": "<html><body>Hello, {{name}}!</body></html>",
            //   "Alias": "welcome-v1",
            //   "LayoutTemplate": "my-layout"
            // }

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
                  message: err.message,
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
          message: "Couldn't login" + err.message,
        };
      });
  }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const Hash = await bcrypt.hash(password, 10);
    const res = await this.prisma.user.findFirst({
      where: { email: createUserDto.email, isDeleted: false },
    });
    if (res) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email already exists',
      };
    }

    const classId = createUserDto.classID;
    return this.prisma.user
      .create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: Hash,
          School_class: { connect: { id: classId } },
        },
      })
      .then(async (user) => {
        return {
            statusCode: HttpStatus.OK,
            message: 'User created successfully',
            user,
        }
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't create user",
        };
      });
  }

  async findAll() {
    return this.prisma.user
      .findMany({
        where: { isDeleted: false },
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't fetch users",
        };
      });
  }

  async findOne(id: string) {
    return this.prisma.user
      .findUnique({
        where: { id, isDeleted: false },
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't fetch user",
        };
      });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user
      .update({
        where: { id, isDeleted: false },
        data: { ...updateUserDto },
      })
      .then((user) => {
        return {
          statusCode: 200,
          message: `user is updated successfully`,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: err.message,
        };
      });
  }

  async remove(id: string) {
    return this.prisma.user
      .update({
        where: { id },
        data: { isDeleted: true },
      })
      .then((user) => {
        return {
          statusCode: 200,
          message: `user is deleted successfully`,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't delete user",
        };
      });
  }
  async validateOTP(verifyOtpDto: VerifyOtpDto) {
    const { otp, otpRef } = verifyOtpDto;
    return await this.prisma.tempOTP
      .findFirst({
        where: { otpRef, expiresAt: { gte: new Date(Date.now()) } },
      })
      .then(async (res) => {
        if (res.otp == otp) {
          const session = await this.prisma.userSession.findFirst({
            where: { id: res.UserSessionId },
          });
          const user = await this.prisma.user.findFirst({
            where: { id: session.userId },
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
          message: 'OTP is invalid or expired',
        };
      });
  }

  generatejwtToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async resendOTP(id: string) {
    console.log(id);

    return await this.prisma.tempOTP
      .findFirst({
        where: { id: objid },
      })
      .then(async (res) => {
        const session = await this.prisma.userSession.findFirst({
          where: { id: res.UserSessionId },
        });

        const user = await this.prisma.user.findFirst({
          where: { id: session.userId },
        });

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpRef = otpGenerator.generate(6, {
          upperCase: false,
          specialChars: false,
          alphabets: false,
        });
        await this.prisma.tempOTP.update({
          where: { id: objid },
          data: { otp, otpRef, expiresAt: new Date(Date.now() + 120000) },
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
