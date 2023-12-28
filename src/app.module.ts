import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ClassModule } from './class/class.module';
import { TeacherModule } from './teacher/teacher.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TimetableModule } from './timetable/timetable.module';

@Module({
  imports: [PrismaModule, UserModule, ClassModule, TeacherModule, AttendanceModule, TimetableModule],
  exports: [PrismaService],
  providers: [PrismaService],

})
export class AppModule {}
