import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SidebarStateService {
  constructor(private readonly prisma: PrismaService) {}

  async getSidebarState(userId: string) {
    // const tasksDataLength = await this.prisma.task.count({
    //   where: {
    //     userId,
    //     isCompleted: false,
    //   },
    // });

    // const notesDataLength = await this.prisma.note.count({
    //   where: {
    //     userId,
    //   },
    // });
    const [tasksDataLength, notesDataLength] = await this.prisma.$transaction([
      this.prisma.task.count({
        where: {
          userId,
          isCompleted: false,
        },
      }),
      this.prisma.note.count({
        where: {
          userId,
        },
      }),
    ]);

    const responseObject = {
      Задачи: tasksDataLength,
      Заметки: notesDataLength,
    };

    return responseObject;
  }
}
