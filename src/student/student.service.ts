import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto, req) {
    return await this.prisma.student
      .create({
        data: {
          name: createStudentDto.name,
          email: createStudentDto.email,
          School_class: {
            connect: {
              id: createStudentDto.classID,
            },
          },
          createdBy: { connect: { id: req.user.res.id } },
        },
        include: { School_class: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Student created successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: err,
        };
      });
  }

  async findAll() {
    return await this.prisma.student
      .findMany({
        where: { isDeleted: false },
        include: { School_class: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Student list',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'No student found',
        };
      });
  }

  async findOne(id: string) {
    return await this.prisma.student
      .findFirst({
        where: { id, isDeleted: false },
        include: { School_class: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Student details',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Student not found',
        };
      });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto, req) {
    return await this.prisma.student
      .update({
        where: { id },
        data: {
          name: updateStudentDto.name,
          email: updateStudentDto.email,
          School_class: {
            connect: {
              id: updateStudentDto.classID,
            },
          },
          updatedBy: { connect: { id: req.user.res.id } },
        },
        include: { School_class: true, updatedBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Student details updated successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Student not found',
        };
      });
  }

  async remove(id: string, req) {
    return await this.prisma.student
      .update({
        where: { id },
        data: {
          isDeleted: true,
          deletedBy: { connect: { id: req.user.res.id } },
        },
        include: { School_class: true, deletedBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Student deleted successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Student not found',
        };
      });
  }
}
