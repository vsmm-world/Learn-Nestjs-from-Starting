import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto, req) {
    return await this.prisma.school_class
      .create({
        data: {
          name: createClassDto.className,
          createdBy: { connect: { id: req.user.res.id } },
        },
        include: { createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Class created successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error creating class',
          data: err,
        };
      });
  }

  async findAll() {
    return await this.prisma.school_class
      .findMany({
        where: {
          isDeleted: false,
        },
        include: { createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Class fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching class',
          data: err,
        };
      });
  }

  async findOne(id: string) {
    return await this.prisma.school_class
      .findFirst({
        where: {
          id: id,
          isDeleted: false,
        },
        include: { createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Class fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching class',
          data: err,
        };
      });
  }

  async update(id: string, updateClassDto: UpdateClassDto, req) {
    return await this.prisma.school_class
      .update({
        where: { id: id, isDeleted: false },
        data: {
          name: updateClassDto.className,
          updatedBy: { connect: { id: req.user.res.id } },
        },
        include: { updatedBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Class updated successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error updating class',
          data: err,
        };
      });
  }

  async remove(id: string, req) {
    return await this.prisma.school_class
      .update({
        where: { id: id },
        data: {
          isDeleted: true,
          deletedBy: { connect: { id: req.user.res.id } },
        },
        include: { deletedBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Class deleted successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error deleting class',
          data: err,
        };
      });
  }
}
