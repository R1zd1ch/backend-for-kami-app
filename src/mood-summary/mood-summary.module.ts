import { Module } from '@nestjs/common';
import { MoodSummaryService } from './mood-summary.service';
import { MoodSummaryController } from './mood-summary.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MoodSummaryController],
  providers: [MoodSummaryService, JwtService],
  exports: [MoodSummaryService],
})
export class MoodSummaryModule {}
