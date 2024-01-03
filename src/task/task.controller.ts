import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { getTeacherDTO, getAttandanceDTO } from './dto/create-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('task')
@ApiTags('All Assigned 9 +2 extra Api-Endpoint')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtfavStud-teachID/:{teacherId}')
  getFavoriteStudentByTecherID(@Param('teacherId') teacherId: string) {
    return this.taskService.getFavoriteStudentByTecherID(teacherId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtClass-studID/:id')
  getClassByStudentID(@Param('id') id: string) {
    return this.taskService.getClassByStudentID(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtTimeTable-techId/:id')
  getTimeTableByTeacherID(@Param('id') id: string) {
    return this.taskService.getTimeTableByTeacherID(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtTimeTable-Day/:id')
  getTimeTableByDay(@Param('id') id: string) {
    return this.taskService.getTimeTableByDay(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtTimetable-classID/:id')
  getTimeTableByClassID(@Param('id') id: string) {
    return this.taskService.getTimeTableByClassID(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtAttand-ClassID/:id')
  getAttanceByClassID(@Param('id') id: string) {
    return this.taskService.getAttanceByClassID(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('gtAttandanceBy-cls-date')
  getAttandanceByDTO(@Body() getAttandanceDTO: getAttandanceDTO) {
    return this.taskService.getAttandanceByDTO(getAttandanceDTO);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtAttnd-date/:id')
  getAttandanceByDate(@Param('id') id: string) {
    return this.taskService.getAttandanceByDate(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('gtTeacherBy-cls-day')
  getTeacherByDTO(@Body() getTeacherDTO: getTeacherDTO) {
    return this.taskService.getTeacherByDTO(getTeacherDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtwhichTeach-studId/:{studentId}')
  getWhichTeacherByStudentID(@Param('studentId') id: string) {
    return this.taskService.getWhichTeacherByStudentID(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('gtTech-SubID/:id')
  getTeacherBySubjectID(@Param('id') id: string) {
    return this.taskService.getTeacherBySubjectID(id);
  }
}
