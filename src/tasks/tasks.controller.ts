import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':id')
  createTask(@Param('id') id: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(id, createTaskDto);
  }

  @Get('length/:id')
  getTasksLength(@Param('id') id: string) {
    return this.tasksService.getTasksLength(id);
  }

  @Get(':id/:taskId')
  getTask(@Param('id') id: string, @Param('taskId') taskId: string) {
    return this.tasksService.getTask(id, taskId);
  }

  @Get(':id')
  getTasks(@Param('id') id: string) {
    return this.tasksService.getTasks(id);
  }

  @Put(':id/:taskId')
  updateTaskStatus(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, taskId, updateTaskDto);
  }

  @Delete(':id/:taskId')
  deleteTask(@Param('id') id: string, @Param('taskId') taskId: string) {
    return this.tasksService.deleteTask(id, taskId);
  }
}
