import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  login(loginUserDto: LoginUserDto) {
    return this.prisma.user
      .findFirst({
        where: { email: loginUserDto.email ,isDeleted:false},
      })
      .then(async (user) => {
        if (user) {
          const match = bcrypt.compare(loginUserDto.password, user.password);
          if (match) {
            const token = this.generatejwtToken(user.id);
            const accessToken = await this.prisma.userSession.create({
              data: { token, user: { connect: { id: user.id } } },
            });
            return accessToken;
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

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const Hash = await bcrypt.hash(password, 10);
    const res = await this.prisma.user.findFirst({
      where: { email: createUserDto.email ,isDeleted:false},
    });
    if (res) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email already exists',
      };
    }
    return this.prisma.user
      .create({
        data: {...createUserDto, password: Hash },
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Couldn't create user",
        };
      });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
    }).catch((err) => {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Couldn't fetch users",
      };
    });
  }

  async findOne(id: string) {
    return this.prisma.user
      .findUnique({
        where: { id ,isDeleted:false},
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
        where: { id ,isDeleted:false },
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
  generatejwtToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
