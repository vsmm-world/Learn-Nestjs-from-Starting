import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto, req) {
    const usr = await this.prisma.user.findFirst({
      where: { id: req.user.id },
    });

    return await this.prisma.student
      .create({
        data: {
          ...createStudentDto,
          School_class: {
            connect: {
              id: createStudentDto.classID,
            },
          },
          createdBy: { connect: { id: req.user.id } },
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
          message: err.message,
        };
      });
  }

  async findAll() {
    return await this.prisma.student
      .findMany({
        where: { isDeleted: false },
        include: { School_class: true },
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
    return `This action returns a #${id} student`;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto , req) {
    return await this.prisma.student.update({
      where: { id },
      data: { ...updateStudentDto, updatedBy: { connect: { id: req.user.id } } },
      include: { School_class: true ,updatedBy:true},
    });
  }

  async remove(id: string) {
    return `This action removes a #${id} student`;
  }
}
