import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { TestDto } from './grad-test.dto';
import { GradeSummaryDto } from './grade-summary.dto';

/**
 * DTO for a submission.
 */
export class SubmissionDto {
	/**
	 * Nested DTO for a grade summary.
	 */
	@ValidateNested()
	@Type(() => GradeSummaryDto)
	summary: GradeSummaryDto;

	/**
	 * The duration of the submission in seconds.
	 *
	 * @example 0.0909
	 */
	@IsNumber()
	duration: number;

	/**
	 * Array of nested DTOs for test results.
	 */
	@ValidateNested({ each: true })
	@Type(() => TestDto)
	tests: TestDto[];
}
