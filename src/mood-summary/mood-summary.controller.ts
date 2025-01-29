import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { MoodSummaryService } from './mood-summary.service';

@Injectable()
@Controller('mood/mood-summary')
export class MoodSummaryController {
  constructor(private readonly moodSummaryService: MoodSummaryService) {}

  @Get('/by-interval/:id/:start/:end/:interval')
  getMoodAverageByInterval(
    @Param('id') id: string,
    @Param('start') start: string,
    @Param('end') end: string,
    @Param('interval') interval: 'day' | 'week' | 'month' | 'year',
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.moodSummaryService.getMoodAverageByInterval(
      id,
      startDate,
      endDate,
      interval,
    );
  }

  @Get('/by-day/:id/:start/:end')
  getSummaryByDay(
    @Param('id') id: string,
    @Param('start') start: string,
    @Param('end') end: number,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.moodSummaryService.getSummaryByDay(id, startDate, endDate);
  }

  @Get('/by-current-day/:id')
  getSummaryByCurrentDay(@Param('id') id: string) {
    return this.moodSummaryService.getSummaryByCurrentDay(id);
  }

  @Get('/by-week/:id/:start/:end')
  getMoodSummaryByWeek(
    @Param('id') id: string,
    @Param('start') start: string,
    @Param('end') end: string,
  ) {
    const week = new Date(start);
    const year = new Date(end);
    return this.moodSummaryService.getMoodSummaryByWeek(id, week, year);
  }

  @Get('/by-current-week/:id')
  getMoodSummaryByCurrentWeek(@Param('id') id: string) {
    return this.moodSummaryService.getMoodSummaryByCurrentWeek(id);
  }

  @Get('/by-current-month/:id')
  getMoodSummaryByCurrentMonth(@Param('id') id: string) {
    return this.moodSummaryService.getMoodSummaryByCurrentMonth(id);
  }

  @Get('/by-month/:id/:month/:year')
  getMoodSummaryByMonth(
    @Param('id') id: string,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    const parsedMonth = Number(month);
    const parsedYear = Number(year);
    return this.moodSummaryService.getMoodSummaryByMonth(
      id,
      parsedMonth,
      parsedYear,
    );
  }

  @Get('/by-year/:id/:year')
  getMoodSummaryByYear(@Param('id') id: string, @Param('year') year: number) {
    const parsedYear = Number(year);
    return this.moodSummaryService.getMoodSummaryByYear(id, parsedYear);
  }
}
