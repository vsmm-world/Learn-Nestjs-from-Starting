import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto) {
    return await this.prisma.teacher
      .create({
        data: {
          name: createTeacherDto.teacherName,
          email: createTeacherDto.teacherEmail,
          user: { connect: { id: createTeacherDto.favoriteStudent } },
        },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Teacher created successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error creating teacher',
          data: err,
        };
      });
  }

  async findAll() {
    return await this.prisma.teacher.findMany({
      where: {
        isDeleted: false,
      },
    }).then((res) => {
      return {
        statusCode: 200,
        message: 'Teacher fetched successfully',
        data: res,
      };
    }).catch((err) => {
      return {
        statusCode: 400,
        message: 'Error fetching teacher',
        data: err,
      };
    });
  }

  async findOne(id: string) {
    return await this.prisma.teacher.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    }).then((res) => {
      return {
        statusCode: 200,
        message: 'Teacher fetched successfully',
        data: res,
      };
    }).catch((err) => {
      return {
        statusCode: 400,
        message: 'Error fetching teacher',
        data: err,
      };
    });
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    return await this.prisma.teacher.update({
      where: {
        id: id,
      },
      data: {
        name: updateTeacherDto.teacherName,
        email: updateTeacherDto.teacherEmail,
        user: { connect: { id: updateTeacherDto.favoriteStudent } },
      },
    }).then((res) => {
      return {
        statusCode: 200,
        message: 'Teacher updated successfully',
        data: res,
      };
    }).catch((err) => {
      return {
        statusCode: 400,
        message: 'Error updating teacher',
       
      };
    });
  }

  async remove(id: string) {
    return await this.prisma.teacher.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    }).then((res) => {
      return {
        statusCode: 200,
        message: 'Teacher deleted successfully',
        data: res,
      };
    }).catch((err) => {
      return {
        statusCode: 400,
        message: 'Error deleting teacher',
        data: err,
      };
    });
  }
}
