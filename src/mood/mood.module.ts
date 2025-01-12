import { Module } from '@nestjs/common';
import { MoodService } from './mood.service';
import { MoodController } from './mood.controller';
import { MoodSummaryModule } from 'src/mood-summary/mood-summary.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MoodSummaryModule, PrismaModule],
  controllers: [MoodController],
  providers: [MoodService, JwtService],
})
export class MoodModule {}
