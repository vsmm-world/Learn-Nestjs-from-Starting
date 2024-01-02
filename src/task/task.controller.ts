import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { getTeacherDTO, getAttandanceDTO } from './dto/create-task.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('task')
@ApiTags('All Assigned 9 +2 extra Api-Endpoint')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('gtfavStud-teachID/:id')
  getFavoriteStudentByTecherID(@Param('id') id: string) {
    return this.taskService.getFavoriteStudentByTecherID(id);
  }
  @Get('gtClass-studID/:id')
  getClassByStudentID(@Param('id') id: string) {
    return this.taskService.getClassByStudentID(id);
  }
  @Get('gtTimeTable-techId/:id')
  getTimeTableByTeacherID(@Param('id') id: string) {
    return this.taskService.getTimeTableByTeacherID(id);
  }
  @Get('gtTimeTable-Day/:id')
  getTimeTableByDay(@Param('id') id: string) {
    return this.taskService.getTimeTableByDay(id);
  }

  @Get('gtTimetable-classID/:id')
  getTimeTableByClassID(@Param('id') id: string) {
    return this.taskService.getTimeTableByClassID(id);
  }
  @Get('gtAttand-ClassID/:id')
  getAttanceByClassID(@Param('id') id: string) {
    return this.taskService.getAttanceByClassID(id);
  }

  @Post('gtAttandanceBy-cls-date')
  getAttandanceByDTO(@Body() getAttandanceDTO: getAttandanceDTO) {
    return this.taskService.getAttandanceByDTO(getAttandanceDTO);
  }

  @Get('gtAttnd-date/:id')
  getAttandanceByDate(@Param('id') id: string) {
    return this.taskService.getAttandanceByDate(id);
  }
  @Post('gtTeacherBy-cls-day')
  getTeacherByDTO(@Body() getTeacherDTO: getTeacherDTO) {
    return this.taskService.getTeacherByDTO(getTeacherDTO);
  }

  @Get('gtwhichTeach-studId/:id')
  getWhichTeacherByStudentID(@Param('id') id: string) {
    return this.taskService.getWhichTeacherByStudentID(id);
  }

  @Get('gtTech-SubID/:id')
  getTeacherBySubjectID(@Param('id') id: string) {
    return this.taskService.getTeacherBySubjectID(id);
  }
}
