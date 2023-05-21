import { IsGreaterOrEqualValidator, IsSmallerOrEqualValidator } from '@rspd/shared/backend/utils';
import { IsInt, Max, Min } from 'class-validator';

import { AssignmentDto } from './assignment.dto';

export class GithubAssignmentDto extends AssignmentDto {
	/**
	 * The minimum number of tests that must pass for the assignment to be considered successful.
	 * @type {number}
	 * @param {number} value - The value of the property must be smaller than the value of totalTests.
	 */
	@IsInt()
	@Min(1)
	@IsSmallerOrEqualValidator('minPassedTests', {
		message:
			'The total amount of tests must be greater than the minimum amount of passing tests',
	})
	minPassedTests: number;

	/**
	 * The total number of tests for the assignment.
	 * @type {number}
	 * @param {number} value - The value of the property must be greater than the value of minPassedTests.
	 */
	@IsInt()
	@Max(10)
	@IsGreaterOrEqualValidator('minPassedTests', {
		message:
			'The total amount of tests must be greater than the minimum amount of passing tests',
	})
	totalTests: number;
}
