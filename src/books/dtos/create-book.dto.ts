import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsIn,
  IsUrl,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsOptional()
  @IsIn(['to-read', 'reading', 'completed'])
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  publishedDate?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  pages?: string;

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsBoolean()
  isFavourite?: boolean;

  @IsOptional()
  @IsDateString()
  reсeived?: Date;
}
