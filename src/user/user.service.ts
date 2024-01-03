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
  // whoAmI(user: any) {
  //   console.log(user);

  //   return this.prisma.user.findFirst({
  //     where: { id: user.sub },
  //   }).then((res) => {
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: 'User found',
  //       res,
  //     };
  //   }
  //   ).catch((err) => {
  //     return {
  //       statusCode: HttpStatus.BAD_REQUEST,
  //       message: err.message,
  //     };
  //   });

  // }

  // async whoAmI(id: string) {
  //   console.log(id);
  //   return await this.prisma.userSession
  //     .findFirst({
  //       where: { token: id, expiresAt: { gte: new Date(Date.now()) } },
  //     })
  //     .then(async (res) => {
  //       const session = res;
  //       const user = await this.prisma.user.findFirst({
  //         where: { id: res.userId },
  //       });
  //       return {
  //         statusCode: HttpStatus.OK,
  //         message: 'User found',
  //         user,
  //         session,
  //       };
  //     })
  //     .catch((err) => {
  //       return {
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         message: err.message,
  //       };
  //     });
  // }

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

    const classId = createUserDto.classID;
    return this.prisma.user
      .create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: Hash,
          // School_class: { connect: { id: classId } },
        },
        // include: { School_class: true },
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
        // include: { School_class: true },
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't fetch users",
        };
      });
  }

  async findOne(id: string) {
    console.log(id);

    if (id.length < 12) {
      return id;
    }
    return await this.prisma.user
      .findUnique({
        where: { id, isDeleted: false },
        // include: { School_class: true },
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
          message: err,
        };
      });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user
      .update({
        where: { id, isDeleted: false },
        data: { ...updateUserDto },
        // include: { School_class: true },
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
        // include: { School_class: true },
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
