import { IsNumber } from 'class-validator';

export class GradeSummaryDto {
    @IsNumber()
    passed: number;

    @IsNumber()
    failed: number;

    @IsNumber()
    total: number;
}
