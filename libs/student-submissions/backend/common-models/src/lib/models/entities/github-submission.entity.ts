import { ChildEntity, Column, JoinColumn, OneToMany } from 'typeorm';

import { AssignmentSubmission } from './assignment-submission.entity';
import { GithubTest } from './github-test.entity';

/**
 * Extends the Submission class to include tests and duration of the grading process
 */
@ChildEntity()
export class GithubSubmission extends AssignmentSubmission {
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
