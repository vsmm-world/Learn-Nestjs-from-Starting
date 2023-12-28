import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
 imports:[PrismaModule],
  controllers: [ClassController,],
  providers: [ClassService,],
  exports: [ClassService,],
})
export class ClassModule {}
