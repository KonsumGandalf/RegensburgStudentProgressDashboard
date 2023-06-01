import { GithubAssignment } from '@rspd/challenge-management/backend/common-models';
import { AssignmentType } from '@rspd/shared/backend/utils';
import { ChildEntity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AssignmentSubmission } from './assignment-submission.entity';
import { GithubTest } from './github-test.entity';

/**
 * Extends the Submission class to include tests and duration of the grading process
 */
@ChildEntity(AssignmentType.GITHUB)
export class GithubSubmission extends AssignmentSubmission {
	/**
	 * The assignment a submissions is done for.
	 *
	 * @type {GithubAssignment}
	 */
	@ManyToOne(() => GithubAssignment, (assignment: GithubAssignment) => assignment.submissions)
	@JoinColumn()
	override assignment: GithubAssignment;

	/**
	 * References the GithubTests which were performed in one iteration of the grading process
	 */
	@OneToMany(() => GithubTest, (test: GithubTest) => test.submission, {
		onUpdate: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	tests: GithubTest[];

	/**
	 * Duration of the GithubSubmission in seconds
	 */
	@Column({ type: 'int2' })
	duration: number;
}
