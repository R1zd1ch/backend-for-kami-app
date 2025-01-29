import { Injectable } from '@nestjs/common';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoodSummaryService } from 'src/mood-summary/mood-summary.service';

@Injectable()
export class MoodService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moodSummaryService: MoodSummaryService,
  ) {}

  async addMood(id: string, addMoodDto: CreateMoodDto) {
    const newMood = await this.prisma.mood.create({
      data: {
        ...addMoodDto,
        user: {
          connect: {
            id,
          },
        },
      },
    });

    const moodDate = new Date(newMood.date);
    const month = moodDate.getMonth() + 1;
    const year = moodDate.getFullYear();

    await this.moodSummaryService.updateMoodSummary(id, month, year);

    return newMood;
  }

  async findAllMoods(id: string) {
    return await this.prisma.mood.findMany({
      where: {
        userId: id,
      },
    });
  }

  async findAllMoodsByCurrentDay(id: string) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    return await this.findAllMoodsByDay(id, startDate, endDate);
  }

  async findAllMoodsByDay(id: string, startDate: Date, endDate: Date) {
    return await this.prisma.mood.findMany({
      where: {
        userId: id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async findAllMoodsByCurrentWeek(id: string) {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    return await this.findAllMoodsByWeek(id, startDate, endDate);
  }

  async findAllMoodsByWeek(id: string, startDate: Date, endDate: Date) {
    return await this.prisma.mood.findMany({
      where: {
        userId: id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async findAllMoodsByCurrentMonth(id: string) {
    const today = new Date();

    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    return await this.findAllMoodsByMonth(id, startDate, endDate);
  }

  async findAllMoodsByMonth(id: string, startDate: Date, endDate: Date) {
    return await this.prisma.mood.findMany({
      where: {
        userId: id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async findAllMoodsByCurrentYear(id: string) {
    const today = new Date();

    return await this.findAllMoodsByYear(id, today.getFullYear());
  }

  async findAllMoodsByYear(id: string, year: number) {
    return await this.prisma.mood.findMany({
      where: {
        userId: id,
        date: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31),
        },
      },
    });
  }

  async findOneMood(id: string, moodId: string) {
    return await this.prisma.mood.findUnique({
      where: {
        userId: id,
        id: moodId,
      },
    });
  }

  async findRecentCreatedMood(id: string) {
    return await this.prisma.mood.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }

  async findRecentUpdatedMood(id: string) {
    return await this.prisma.mood.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 10,
    });
  }

  async findRecentMood(id: string) {
    const recentCreated = await this.findRecentCreatedMood(id);
    const recentUpdated = await this.findRecentUpdatedMood(id);

    return {
      recentCreated,
      recentUpdated,
    };
  }

  async updateMood(id: string, moodId: string, updateMoodDto: UpdateMoodDto) {
    const updatedMood = await this.prisma.mood.update({
      where: {
        userId: id,
        id: moodId,
      },
      data: {
        ...updateMoodDto,
      },
    });

    const moodDate = new Date(updatedMood.date);

    const month = moodDate.getMonth() + 1;
    const year = moodDate.getFullYear();

    await this.moodSummaryService.updateMoodSummary(id, month, year);

    return updatedMood;
  }

  async removeMood(id: string, moodId: string) {
    const moodToDelete = await this.prisma.mood.findUnique({
      where: {
        userId: id,
        id: moodId,
      },
    });

    if (!moodToDelete) {
      throw new Error('Mood not found');
    }

    const deletedMood = await this.prisma.mood.delete({
      where: {
        id: moodId,
        userId: id,
      },
    });

    const moodDate = new Date(deletedMood.date);

    const month = moodDate.getMonth() + 1;
    const year = moodDate.getFullYear();

    await this.moodSummaryService.updateMoodSummary(id, month, year);

    return deletedMood;
  }
}
