import { AssignmentType } from '@rspd/shared/backend/utils';
import { ChildEntity, Column } from 'typeorm';

import { Assignment } from './assignment.entity';

@ChildEntity(AssignmentType.GITHUB)
export class GithubAssignment extends Assignment {
	/**
	 * The minimum number of tests that must pass for the assignment to be considered successful.
	 *
	 * @type {number}
	 */
	@Column({ type: 'smallint' })
	minPassedTests: number;

	/**
	 * The total number of tests for the assignment.
	 *
	 * @type {number}
	 */
	@Column({ type: 'smallint' })
	totalTests: number;
}
