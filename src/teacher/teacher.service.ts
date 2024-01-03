import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto,req) {
    return await this.prisma.teacher
      .create({
        data: {
          name: createTeacherDto.teacherName,
          email: createTeacherDto.teacherEmail,
          student: { connect: { id: createTeacherDto.favoriteStudent } },
          subjects: { connect: { id: createTeacherDto.subject } },
          createdBy: { connect: { id: req.user.res.id } },
        },
        include: { student: true, subjects: true ,createdBy:true},
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
    return await this.prisma.teacher
      .findMany({
        where: {
          isDeleted: false,
        },
        include: { student: true, subjects: true,createdBy:true},
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Teacher fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching teacher',
          data: err,
        };
      });
  }

  async findOne(id: string) {
    return await this.prisma.teacher
      .findFirst({
        where: {
          id: id,
          isDeleted: false,
        },
        include: { student: true, subjects: true ,createdBy:true},
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Teacher fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching teacher',
          data: err,
        };
      });
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto,req) {
    return await this.prisma.teacher
      .update({
        where: {
          id: id,
        },
        data: {
          name: updateTeacherDto.teacherName,
          email: updateTeacherDto.teacherEmail,
          student: { connect: { id: updateTeacherDto.favoriteStudent } },
          subjects: { connect: { id: updateTeacherDto.subject } },
          updatedBy: { connect: { id:req.user.res.id} },
        },
        include: { student: true, subjects: true ,updatedBy:true},
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Teacher updated successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error updating teacher',
        };
      });
  }

  async remove(id: string,req) {
    return await this.prisma.teacher
      .update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
          deletedBy: { connect: { id: req.user.res.id } },
        },
        include: { student: true, subjects: true , deletedBy:true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Teacher deleted successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error deleting teacher',
          data: err,
        };
      });
  }
}
