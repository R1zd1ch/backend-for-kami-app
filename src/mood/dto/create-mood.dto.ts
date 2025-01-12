import { Optional } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';

export class CreateMoodDto {
  @IsNumber()
  moodLevel: number;

  @Optional()
  @IsString()
  note: string;
}
