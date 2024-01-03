import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto, req) {
    return await this.prisma.attendance
      .create({
        data: {
          student: { connect: { id: createAttendanceDto.studentid } },
          School_class: { connect: { id: createAttendanceDto.classid } },
          present: createAttendanceDto.present,
          Date: createAttendanceDto.date,
          createdBy: { connect: { id: req.user.res.id } },
        },
        include: { School_class: true, student: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Attendance created successfully',
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
    return await this.prisma.attendance
      .findMany({
        where: {
          isDeleted: false,
        },
        include: { School_class: true, student: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Attendance fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching attendance',
        };
      });
  }

  async findOne(id: string) {
    return await this.prisma.attendance
      .findFirst({
        where: {
          id: id,
          isDeleted: false,
        },
        include: { School_class: true, student: true, createdBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Attendance fetched successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error fetching attendance',
        };
      });
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto, req) {
    return await this.prisma.attendance
      .update({
        where: {
          id: id,
        },
        data: {
          student: { connect: { id: updateAttendanceDto.studentid } },
          School_class: { connect: { id: updateAttendanceDto.classid } },
          present: updateAttendanceDto.present,
          Date: updateAttendanceDto.date,
          updatedBy: { connect: { id: req.user.res.id } },
        },
        include: { School_class: true, student: true, updatedBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Attendance created successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error creating attendance',
        };
      });
  }

  async remove(id: string, req) {
    return await this.prisma.attendance
      .update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
          deletedBy: { connect: { id: req.user.res.id } },
        },
        include: { School_class: true, student: true, deletedBy: true },
      })
      .then((res) => {
        return {
          statusCode: 200,
          message: 'Attendance deleted successfully',
          data: res,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: 'Error deleting attendance',
          data: err,
        };
      });
  }
}
