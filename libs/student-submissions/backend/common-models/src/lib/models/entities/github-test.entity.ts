import { BaseEntity } from '@rspd/shared/backend/utils';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TestOutcome } from '../enums/test-outcome.enum';
import { GithubSubmission } from './github-submission.entity';

/**
 * Entity representing a test which was performed in one iteration of the grading process.
 */
@Entity()
export class GithubTest extends BaseEntity {
	/**
	 * The error message associated with the test, if any.
	 */
	@Column({ type: 'varchar', nullable: true })
	errorMsg?: string;

	/**
	 * The outcome of the test.
	 */
	@Column({ type: 'enum', enum: TestOutcome, default: TestOutcome.PASSED })
	outcome: TestOutcome;

	/**
	 * The GitHub submission associated with this test.
	 */

	@ManyToOne(() => GithubSubmission, (submission: GithubSubmission) => submission.tests)
	@JoinColumn({ name: 'submission_id' })
	submission: GithubSubmission;

	/**
	 * The number of wrong tests the user submitted
	 *
	 * @type {Student}
	 */
	@Column({ type: 'int4', default: 0 })
	failedRuns: number;

	/**
	 * The id of a test inside an assignment
	 *
	 * @type {Student}
	 */
	@Column({ type: 'int2' })
	localId: number;
}
