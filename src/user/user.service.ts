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
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: Hash,
        },
      })
      .then(async (user) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'User created successfully',
          user,
        };
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

    return await this.prisma.user
      .findUnique({
        where: { id, isDeleted: false },
      })
      .then((res) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'User found',
          res,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
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
}
