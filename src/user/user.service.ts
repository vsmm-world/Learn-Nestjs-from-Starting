import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private client: postmark.ServerClient,
  ) {
    this.client = new postmark.ServerClient('');
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

            const tempOTP = await this.prisma.tempOTP
              .create({
                data: { otp, otpRef, user: { connect: { id: user.id } } },
              })
              .catch((err) => {
                return {
                  statusCode: HttpStatus.BAD_REQUEST,
                  message: "Couldn't create OTP",
                };
              });

            const mail = {
              From: 'vsmmworld@gmail.com',
              To: user.email,
              Subject: 'Test',
              TextBody: 'Hello from Postmark!',
              html: `<h1>Hi ${user.name}</h1><p>Your OTP is ${otp}</p>
                <p>OTP Ref is ${otpRef}</p>`,
            };

            return await this.client
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
                  message: "Couldn't send OTP",
                };
              });

            // const token = this.generatejwtToken(user.id);
            // const accessToken = await this.prisma.userSession.create({
            //   // data: { token, user: { connect: { id: user.id } } },
            // });
            // return accessToken;
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
    const tempOTP = await this.prisma.tempOTP
      .findFirst({
        where: { otp },
      })
      .then((res) => {
        if (res.otpRef === otpRef) {
          return {
            statusCode: 200,
            message: `OTP is validated successfully`,
          };
        }
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't validate OTP",
        };
      });
  }

  generatejwtToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
