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

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    // private client: postmark.ServerClient,
  ) {
    // this.client = new postmark.ServerClient('2adfac99-b974-45bb-abce-9277c0e4bbb2');
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
                },
              })
              .then((res) => {
                console.log(res);
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
              otpRef: otpRef,
            },
            From: 'rushi@syscreations.com',
            To: user.email,
            Subject: 'Test',
            TextBody: 'Hello from Postmark!',
            HtmlBody:
              `<html>` +
              `<body>` +
              `<h1>` +
              otp +
              `</h1>` +
              `<p>` +
              otpRef +
              `</p>` +
              `</body>` +
              `</html>`,
            };

            
            const client = new postmark.ServerClient(
              env.POSTMARK_SERVER_TOKEN,
            );
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
    return this.prisma.user
      .create({
        data: { ...createUserDto, password: Hash },
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
        where: { otpRef },
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
            data: { token },
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
          message: 'OTP is invalid',
        };
      });
  }

  generatejwtToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
