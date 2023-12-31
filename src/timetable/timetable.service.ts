import { Injectable } from '@nestjs/common';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}
  async create(createTimetableDto: CreateTimetableDto, req) {
    return await this.prisma.timeTable
      .create({
        data: {
          day: createTimetableDto.day,
          teacher: { connect: { id: createTimetableDto.teacherId } },
          School_class: { connect: { id: createTimetableDto.classId } },
          createdBy: { connect: { id: req.user.res.id } },
        },
        include: { teacher: true, School_class: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Timetable created successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error creating timetable',
        };
      });
  }

  async findAll() {
    return await this.prisma.timeTable
      .findMany({
        where: {
          isDeleted: false,
        },
        include: { teacher: true, School_class: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Timetable fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching timetable',
        };
      });
  }

  async findOne(id: string) {
    return await this.prisma.timeTable
      .findFirst({
        where: {
          id: id,
          isDeleted: false,
        },
        include: { teacher: true, School_class: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Timetable fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching timetable',
        };
      });
  }

  async update(id: string, updateTimetableDto: UpdateTimetableDto, req) {
    return await this.prisma.timeTable
      .update({
        where: {
          id: id,
        },
        data: {
          day: updateTimetableDto.day,
          teacher: { connect: { id: updateTimetableDto.teacherId } },
          School_class: { connect: { id: updateTimetableDto.classId } },
          updatedBy: { connect: { id: req.user.res.id } },
        },
        include: { teacher: true, School_class: true, updatedBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Timetable updated successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error updating timetable',
        };
      });
  }

  async remove(id: string, req) {
    return await this.prisma.timeTable
      .update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
          deletedBy: { connect: { id: req.user.res.id } },
        },
        include: { teacher: true, School_class: true, deletedBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Timetable deleted successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error deleting timetable',
        };
      });
  }
}
