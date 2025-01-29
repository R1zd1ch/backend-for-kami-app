import { IsDateString, IsOptional } from 'class-validator';
import { CreateGiftDto } from './create-gift.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateGiftDto extends PartialType(
  OmitType(CreateGiftDto, ['name'] as const),
) {
  @IsOptional()
  @IsDateString()
  received?: Date;
}
