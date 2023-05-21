import { AssignmentType } from '@rspd/shared/backend/utils';
import { GithubSubmission } from '@rspd/student-submissions/backend/common-models';
import { ChildEntity, Column, JoinColumn, OneToMany } from 'typeorm';

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

	/**
	 * The submissions associated with the assignment
	 *
	 * @type {UnionAssignment[]}
	 */
	@OneToMany(() => GithubSubmission, (submission: GithubSubmission) => submission.assignment)
	@JoinColumn()
	submissions: GithubSubmission[];
}
