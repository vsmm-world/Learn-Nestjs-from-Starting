import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}
  async create(createSubjectDto: CreateSubjectDto) {
    return await this.prisma.subjects
      .create({
        data: {
          name: createSubjectDto.subjectName,
        },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Subject created successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error creating subject',
        };
      });
  }

  async findAll() {
    return await this.prisma.subjects
      .findMany({
        where: {
          isDeleted: false,
        },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Subject fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching subject',
        };
      });
  }

  async findOne(id: string) {
    return await this.prisma.subjects
      .findFirst({
        where: {
          id: id,
          isDeleted: false,
        },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Subject fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching subject',
        };
      });
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    return await this.prisma.subjects
      .update({
        where: {
          id: id,
          isDeleted: false,
        },
        data: {
          name: updateSubjectDto.subjectName,
        },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Subject updated successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error updating subject',
        };
      });
  }

  async remove(id: string) {
    return await this.prisma.subjects
      .update({
        where: {
          id: id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Subject deleted successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error deleting subject',
        };
      });
  }
}
