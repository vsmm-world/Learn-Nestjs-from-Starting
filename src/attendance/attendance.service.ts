import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    return await this.prisma.attendance
      .create({
        data: {
          user: { connect: { id: createAttendanceDto.studentid } },
          School_class: { connect: { id: createAttendanceDto.classid } },
          present: createAttendanceDto.present,
          day: createAttendanceDto.day,
        },
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

  async findAll() {
    return await this.prisma.attendance
      .findMany({
        where: {
          isDeleted: false,
        },
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

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    return await this.prisma.attendance
      .update({
        where: {
          id: id,
        },
        data: {
          user: { connect: { id: updateAttendanceDto.studentid } },
          School_class: { connect: { id: updateAttendanceDto.classid } },
          present: updateAttendanceDto.present,
          day: updateAttendanceDto.day,
        },
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
          data: err,
        };
      });
  }

  async remove(id: string) {
    return await this.prisma.attendance
      .update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
        },
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
