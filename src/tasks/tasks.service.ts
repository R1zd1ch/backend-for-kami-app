import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(TasksService.name);

  async createTask(id: string, createTaskDto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId: id,
      },
    });
  }

  async getTask(id: string, taskId: string) {
    return await this.prisma.task.findUnique({
      where: {
        id: taskId,
        userId: id,
      },
    });
  }

  async getTasks(id: string) {
    return await this.prisma.task.findMany({
      where: {
        userId: id,
      },
    });
  }

  async getTasksLength(id: string) {
    const count = await this.prisma.task.count({
      where: {
        userId: id,
      },
    });
    console.log(count);
    return { Задачи: count };
  }

  async updateTask(id: string, taskId: string, updateTaskDto: UpdateTaskDto) {
    return await this.prisma.task.update({
      where: {
        id: taskId,
        userId: id,
      },
      data: {
        ...updateTaskDto,
      },
    });
  }

  async deleteTask(id: string, taskId: string) {
    return await this.prisma.task.delete({
      where: {
        id: taskId,
        userId: id,
      },
    });
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Called when the current second is 0');
    const completedTasks = await this.prisma.task.findMany({
      where: {
        isCompleted: true,
      },
    });

    const now = new Date();
    const tasksToDelete = completedTasks.filter((task) => {
      const completedDate = new Date(task.updatedAt);
      const diffTime = Math.abs(now.getTime() - completedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 1;
    });

    for (const task of tasksToDelete) {
      await this.prisma.task.delete({
        where: {
          id: task.id,
        },
      });
      this.logger.debug(`Deleted task with ID ${task.id}`);
    }
  }
}
