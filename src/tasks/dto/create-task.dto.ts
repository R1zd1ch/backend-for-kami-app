import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  selectDay: string;

  @IsString()
  importance: string;

  @IsString()
  subject: string;

  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsBoolean()
  IsComleted?: boolean;
}
