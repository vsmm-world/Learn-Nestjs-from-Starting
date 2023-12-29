import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ClassModule } from './class/class.module';
import { TeacherModule } from './teacher/teacher.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TimetableModule } from './timetable/timetable.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [PrismaModule, UserModule, ClassModule, TeacherModule, AttendanceModule, TimetableModule, SubjectsModule, TaskModule],
  exports: [PrismaService],
  providers: [PrismaService],

})
export class AppModule {}
