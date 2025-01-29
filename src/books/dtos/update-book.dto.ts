// src/books/dto/update-book.dto.ts
import {
  Min,
  Max,
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { CreateBookDto } from './create-book.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateBookDto extends PartialType(
  OmitType(CreateBookDto, ['authors', 'title'] as const),
) {
  @IsOptional()
  @IsInt()
  progress?: number;

  @IsOptional()
  @IsIn(['to-read', 'reading', 'completed'])
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  review?: string;

  @IsOptional()
  @IsBoolean()
  isFavourite?: boolean;
}
