import { Submission } from '@rspd/student-submissions/backend/common-models';
import { ChildEntity, Column, ManyToOne, OneToMany } from 'typeorm';

import { GithubTest } from './github-test.entity';

/**
 * Extends the Submission class to include tests and duration of the grading process
 */
@ChildEntity()
export class GithubSubmission extends Submission {
	/**
	 * References the GithubTests which were performed in one iteration of the grading process
	 */
	@OneToMany(() => GithubTest, (test: GithubTest) => test.submission)
	tests: GithubTest[];

	/**
	 * Duration of the GithubSubmission in seconds
	 */
	@Column({ type: 'int2' })
	duration: number;
}
