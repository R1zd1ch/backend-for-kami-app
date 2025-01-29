import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMoodDto {
  @IsNumber()
  moodLevel: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @Optional()
  @IsString()
  note: string;
}
