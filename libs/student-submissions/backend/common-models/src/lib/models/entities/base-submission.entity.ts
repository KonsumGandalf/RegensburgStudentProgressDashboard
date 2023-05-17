import { BaseEntity } from '@rspd/shared/backend/utils';
import { Column, Entity } from 'typeorm';

import { SubmissionState } from '../enums/submission-state.enum';

/**
 * The base class for all submission to inherit.
 */
@Entity()
export class BaseSubmission extends BaseEntity {
	/**
	 * The completion state of the challenge submission.
	 *
	 * @type {SubmissionState}
	 */
	@Column({ type: 'enum', enum: SubmissionState, default: SubmissionState.Unsolved })
	completionState: SubmissionState;
}
