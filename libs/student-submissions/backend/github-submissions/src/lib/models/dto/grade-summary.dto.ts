import { IsNumber } from 'class-validator';

/**
 * Data transfer object representing grade summary of a submission.
 */
export class GradeSummaryDto {
	/**
	 * Number of tests passed.
	 *
	 * @example 4
	 */
	@IsNumber()
	passed: number;

	/**
	 * Number of tests failed.
	 *
	 * @example 1
	 */
	@IsNumber()
	failed: number;

	/**
	 * Total number of tests.
	 *
	 * @example 5
	 */
	@IsNumber()
	total: number;
}
