import { PartialType } from '@nestjs/mapped-types';
import { CreateMoodSummaryDto } from './create-mood-summary.dto';

export class UpdateMoodSummaryDto extends PartialType(CreateMoodSummaryDto) {}
