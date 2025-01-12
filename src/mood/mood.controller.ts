import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @Post(':id')
  addMood(@Param('id') id: string, @Body() createMoodDto: CreateMoodDto) {
    return this.moodService.addMood(id, createMoodDto);
  }

  @Get(':id')
  findAllMoods(@Param('id') id: string) {
    return this.moodService.findAllMoods(id);
  }

  @Get('by-current-day/:id')
  findAllMoodsByCurrentDay(@Param('id') id: string) {
    return this.moodService.findAllMoodsByCurrentDay(id);
  }

  @Get('by-day/:id/:startDate/:endDate')
  findAllMoodsByDay(
    @Param('id') id: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    return this.moodService.findAllMoodsByDay(
      id,
      parsedStartDate,
      parsedEndDate,
    );
  }

  @Get('by-current-week/:id')
  findAllMoodsByCurrentWeek(@Param('id') id: string) {
    return this.moodService.findAllMoodsByCurrentWeek(id);
  }

  @Get('by-week/:id/:startDate/:endDate')
  findAllMoodsByWeek(
    @Param('id') id: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    return this.moodService.findAllMoodsByWeek(
      id,
      parsedStartDate,
      parsedEndDate,
    );
  }

  @Get('by-current-month/:id')
  findAllMoodsByCurrentMonth(@Param('id') id: string) {
    return this.moodService.findAllMoodsByCurrentMonth(id);
  }

  @Get('by-month/:id/:stardDate/:endDate')
  findAllMoodsByMonth(
    @Param('id') id: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    const parsedMonth = new Date(startDate);
    const parsedYear = new Date(endDate);

    return this.moodService.findAllMoodsByMonth(id, parsedMonth, parsedYear);
  }

  @Get(':id/:moodId')
  findOneMood(@Param('id') id: string, @Param('moodId') moodId: string) {
    return this.moodService.findOneMood(id, moodId);
  }

  @Put(':id/:moodId')
  updateMood(
    @Param('id') id: string,
    @Param('moodId') moodId: string,
    @Body() updateMoodDto: UpdateMoodDto,
  ) {
    return this.moodService.updateMood(id, moodId, updateMoodDto);
  }

  @Delete(':id/:moodId')
  removeMood(@Param('id') id: string, @Param('moodId') moodId: string) {
    return this.moodService.removeMood(id, moodId);
  }
}
