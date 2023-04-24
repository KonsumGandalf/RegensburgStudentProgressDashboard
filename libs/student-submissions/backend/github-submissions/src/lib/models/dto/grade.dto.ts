import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { GradeSummaryDto } from './grade-summary.dto';

export class GradeDto {
    @ValidateNested()
    @Type(() => GradeSummaryDto)
    summary: GradeSummaryDto;
}
