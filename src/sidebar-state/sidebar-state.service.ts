import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SidebarStateService {
  constructor(private readonly prisma: PrismaService) {}

  async getSidebarState(userId: string) {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();
    const utcDay = now.getUTCDate();

    const startOfDay = new Date(Date.UTC(utcYear, utcMonth, utcDay));
    const endOfDay = new Date(Date.UTC(utcYear, utcMonth, utcDay + 1) - 1);

    const [
      tasksDataLength,
      notesDataLength,
      moodsDataLength,
      booksDataLength,
      wishListDataLength,
    ] = await this.prisma.$transaction([
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

      this.prisma.mood.count({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      this.prisma.book.count({
        where: {
          userId,
          status: 'to-read',
          progress: {
            gt: 0,
          },
        },
      }),

      this.prisma.gift.count({
        where: {
          userId,
          isCompleted: false,
        },
      }),
    ]);

    const responseObject = {
      Задачи: tasksDataLength,
      Заметки: notesDataLength,
      Настроение: moodsDataLength,
      Книги: booksDataLength,
      'Wish Лист': wishListDataLength,
    };

    return responseObject;
  }
}
