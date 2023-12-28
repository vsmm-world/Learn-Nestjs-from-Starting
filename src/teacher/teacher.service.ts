import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto) {
    return await this.prisma.teacher.create({
      data: {
        name: createTeacherDto.teacherName,
        email: createTeacherDto.teacherEmail,
        user:{ connect: { id: createTeacherDto.favoriteStudent },}
      },
    });
  }

  async findAll() {
    return ;
  }

 async findOne(id: string) {
    return `This action returns a #${id} teacher`;
  }

 async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

 async remove(id: string) {
    return `This action removes a #${id} teacher`;
  }
}
