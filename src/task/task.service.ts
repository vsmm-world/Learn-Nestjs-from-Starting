import { HttpStatus, Injectable } from '@nestjs/common';
import { getTeacherDTO, getAttandanceDTO } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getTeacherBySubjectID(id: string) {
    return await this.prisma.teacher
      .findFirst({
        where: { subjectId: id },
        include: { subjects: true },
      })
      .then((data) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'Teacher data',
          data: data,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: err.message,
        };
      });
  }
  async getWhichTeacherByStudentID(id: string) {
    return await this.prisma.teacher
      .findFirst({
        where: { favoriteStudent: id },
        include: { student: true },
      })
      .then((data) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'Teacher data',
          data: data,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You are not favorite student of any teacher',
        };
      });
  }
  async getTimeTableByClassID(id: string) {
    return await this.prisma.timeTable
      .findMany({
        where: { classId: id },
        include: { teacher: true, School_class: true },
      })
      .then(async (data) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'TimeTable data',
          data: data,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No TimeTable data found',
        };
      });
  }
  async getAttandanceByDate(id: string) {
    return await this.prisma.attendance
      .findMany({
        where: { Date: id },
        include: { School_class: true, student: true },
      })
      .then((data) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'Attandance data',
          data: data,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No Attandance data found',
        };
      });
  }
  async getAttandanceByDTO(getAttandanceDTO: getAttandanceDTO) {
    return await this.prisma.attendance
      .findMany({
        where: {
          classId: getAttandanceDTO.ClassId,
          Date: getAttandanceDTO.Date,
        },include: { School_class: true, student: true },
       
      })
      .then((data) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'Attandance data',
          data: data,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No Attandance data found',
        };
      });
  }
  async getTeacherByDTO(getTeacherDTO: getTeacherDTO) {
    return await this.prisma.timeTable
      .findFirst({
        where: {
          classId: getTeacherDTO.ClassId,
          day: getTeacherDTO.Day,
        },
      })
      .then(async (data) => {
        return await this.prisma.teacher
          .findFirst({
            where: {
              id: data.teacherId,
            },
            // include: { user: true ,subjects:true},
          })
          .then((data) => {
            return {
              statusCode: HttpStatus.OK,
              message: 'Teacher data',
              data: data,
            };
          })
          .catch((err) => {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'No Teacher data found',
            };
          });
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No Teacher data found',
        };
      });
  }
  async getAttanceByClassID(id: string) {
    return await this.prisma.attendance
      .findMany({
        where: { classId: id },
        include: { School_class: true, student: true },
      })
      .then((data) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'Attandance data',
          data: data,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No Attandance data found',
        };
      });
  }
  async getTimeTableByDay(id: string) {
    return await this.prisma.timeTable
      .findMany({
        where: { day: id },
        include: { teacher: true, School_class: true },
      })
      .then((data) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'TimeTable data',
          data: data,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No TimeTable data found',
        };
      });
  }
  async getTimeTableByTeacherID(id: string) {
    return await this.prisma.timeTable
      .findMany({
        where: { teacherId: id },
        include: { teacher: true, School_class: true },
      })
      .then((data) => {
        return {
          statusCode: HttpStatus.OK,
          message: 'TimeTable data',
          data: data,
        };
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No TimeTable data found',
        };
      });
  }

  //REMAINING -- rv.notes

  async getClassByStudentID(id: string) {
    return await this.prisma.student
      .findFirst({
        where: { id: id },
      })
      .then(async (data) => {
        return await this.prisma.school_class
          .findFirst({
            where: { id: data.classId },
          })
          .then((data) => {
            return {
              statusCode: HttpStatus.OK,
              message: 'Class data',
              data: data,
            };
          })
          .catch((err) => {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'No Class data found',
            };
          });
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No Class data found',
        };
      });
  }
  async getFavoriteStudentByTecherID(teacherId: string) {
    return await this.prisma.teacher
      .findFirst({
        where: { id: teacherId },
        include: { student: true,subjects:true },
      })
      .then(async (data) => {
        return await this.prisma.student
          .findFirst({
            where: { id: data.favoriteStudent },
            include: { School_class: true },
          })
          .then((data) => {
            return {
              statusCode: HttpStatus.OK,
              message: 'Favorite Student data',
              data: data,
            };
          })
          .catch((err) => {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'No Favorite Student data found',
            };
          });
      })
      .catch((err) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No Favorite Student data found',
        };
      });
  }
}
