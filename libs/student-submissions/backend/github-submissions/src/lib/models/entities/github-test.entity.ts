import { BaseEntity } from '@rspd/shared/backend/utils';
import { Column, Entity, ManyToOne } from 'typeorm';

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
	 * The state of the test.
	 */
	@Column({ type: 'enum', enum: TestOutcome, default: TestOutcome.PASSED })
	state: TestOutcome;

	/**
	 * The GitHub submission associated with this test.
	 */
	@ManyToOne(() => GithubSubmission, (submission: GithubSubmission) => submission.tests)
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
