import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoodSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getMoodSummaryByWeek(userId: string, startDate: Date, endDate: Date) {
    const moods = await this.prisma.mood.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    if (moods.length === 0) return null;

    const averageWeek =
      moods.reduce((acc, mood) => acc + mood.moodLevel, 0) / moods.length;

    return {
      userId,
      startDate,
      endDate,
      averageWeek,
    };
  }

  async getMoodSummaryByCurrentWeek(userId: string) {
    const today = new Date();

    const dayOfWeek = today.getDay();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    return this.getMoodSummaryByWeek(userId, startDate, endDate);
  }

  async getSummaryByCurrentDay(userId: string) {
    const today = new Date();

    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    return await this.getSummaryByDay(userId, startDate, endDate);
  }

  async getSummaryByDay(userId: string, startDate: Date, endDate: Date) {
    const moods = await this.prisma.mood.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    if (moods.length === 0) return null;

    const averageDay =
      moods.reduce((acc, mood) => acc + mood.moodLevel, 0) / moods.length;

    return {
      userId,
      startDate,
      endDate,
      averageDay,
    };
  }

  async getMoodSummaryByCurrentMonth(userId: string) {
    const today = new Date();

    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    return await this.getMoodSummaryByMonth(
      userId,
      startDate.getMonth(),
      startDate.getFullYear(),
    );
  }

  async getMoodSummaryByMonth(userId: string, month: number, year: number) {
    return await this.prisma.moodSummary.findUnique({
      where: {
        userId_month_year: { userId, month, year },
      },
    });
  }

  async getMoodSummaryByYear(userId: string, year: number) {
    const monthlyMoods = await this.prisma.moodSummary.findMany({
      where: {
        userId,
        year,
      },
    });

    const yearAverageMood =
      monthlyMoods.reduce((acc, mood) => acc + mood.averageMonth, 0) /
      monthlyMoods.length;

    return {
      userId,
      year,
      averageYear: yearAverageMood,
    };
  }

  async updateMoodSummary(userId: string, month: number, year: number) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstDayOfNextMonth = new Date(year, month, 1);

    const moods = await this.prisma.mood.findMany({
      where: {
        userId,
        createdAt: {
          gte: firstDayOfMonth,
          lt: firstDayOfNextMonth,
        },
      },
    });

    if (moods.length === 0) return null;

    const averageMonth =
      moods.reduce((acc, mood) => acc + mood.moodLevel, 0) / moods.length;

    return await this.prisma.moodSummary.upsert({
      where: {
        userId_month_year: { userId, month, year },
      },
      update: {
        averageMonth,
      },
      create: {
        month,
        year,
        averageMonth,
        userId,
      },
    });
  }
}
