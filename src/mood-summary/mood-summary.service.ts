import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoodSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getMoodAverageByInterval(
    userId: string,
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month' | 'year',
  ) {
    // Получаем все записи о настроении пользователя за заданный период
    const moods = await this.prisma.mood.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    if (moods.length === 0) return [];

    // Создание карты для группировки
    const groupedByDay: Record<string, { total: number; count: number }> = {};

    // Группировка настроений по дням
    moods.forEach((mood) => {
      const dayKey = mood.date.toISOString().split('T')[0]; // Формат: "YYYY-MM-DD"
      if (!groupedByDay[dayKey]) {
        groupedByDay[dayKey] = { total: 0, count: 0 };
      }

      groupedByDay[dayKey].total += mood.moodLevel;
      groupedByDay[dayKey].count += 1;
    });

    // Генерация массива всех дней в заданном диапазоне
    const allDays: { date: string; average: number | null }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dayKey = currentDate.toISOString().split('T')[0];
      const average = groupedByDay[dayKey]
        ? groupedByDay[dayKey].total / groupedByDay[dayKey].count
        : null;

      allDays.push({ date: dayKey, average });
      currentDate.setDate(currentDate.getDate() + 1); // Переходим к следующему дню
    }

    // Группировка дней в зависимости от интервала
    if (interval === 'day') {
      return allDays;
    }

    const groupedByInterval: {
      start: string;
      end: string;
      days: typeof allDays;
    }[] = [];

    if (interval === 'week') {
      for (let i = 0; i < allDays.length; i += 7) {
        const weekDays = allDays.slice(i, i + 7);
        groupedByInterval.push({
          start: weekDays[0]?.date || null,
          end: weekDays[weekDays.length - 1]?.date || null,
          days: weekDays,
        });
      }
    } else if (interval === 'month') {
      let currentMonth = allDays[0]?.date.split('-').slice(0, 2).join('-');
      let monthGroup = [];

      for (const day of allDays) {
        const dayMonth = day.date.split('-').slice(0, 2).join('-');
        if (dayMonth !== currentMonth) {
          groupedByInterval.push({
            start: monthGroup[0]?.date || null,
            end: monthGroup[monthGroup.length - 1]?.date || null,
            days: monthGroup,
          });
          monthGroup = [];
          currentMonth = dayMonth;
        }
        monthGroup.push(day);
      }

      if (monthGroup.length > 0) {
        groupedByInterval.push({
          start: monthGroup[0]?.date || null,
          end: monthGroup[monthGroup.length - 1]?.date || null,
          days: monthGroup,
        });
      }
    } else if (interval === 'year') {
      let currentYear = allDays[0]?.date.split('-')[0];
      let yearGroup = [];

      for (const day of allDays) {
        const dayYear = day.date.split('-')[0];
        if (dayYear !== currentYear) {
          groupedByInterval.push({
            start: yearGroup[0]?.date || null,
            end: yearGroup[yearGroup.length - 1]?.date || null,
            days: yearGroup,
          });
          yearGroup = [];
          currentYear = dayYear;
        }
        yearGroup.push(day);
      }

      if (yearGroup.length > 0) {
        groupedByInterval.push({
          start: yearGroup[0]?.date || null,
          end: yearGroup[yearGroup.length - 1]?.date || null,
          days: yearGroup,
        });
      }
    }

    return groupedByInterval;
  }

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
    const monthlyMoods = await this.prisma.mood.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 31),
        },
      },
    });

    const monthAverageMood =
      monthlyMoods.reduce((acc, mood) => acc + mood.moodLevel, 0) /
      monthlyMoods.length;

    const moods = await this.prisma.mood.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 31),
        },
      },
    });

    return {
      userId,
      month,
      year,
      averageMonth: monthAverageMood,
      total: moods,
    };
  }

  async getMoodSummaryByYear(userId: string, year: number) {
    const monthlyMoods = await this.prisma.mood.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31),
        },
      },
    });

    const yearAverageMood =
      monthlyMoods.reduce((acc, mood) => acc + mood.moodLevel, 0) /
      monthlyMoods.length;

    const moods = await this.prisma.mood.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31),
        },
      },
    });

    return {
      userId,
      year,
      averageYear: yearAverageMood,
      total: moods,
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
