import { PartialType } from '@nestjs/mapped-types';
import { CreateMoodDto } from './create-mood.dto';

export class UpdateMoodDto extends PartialType(CreateMoodDto) {}
