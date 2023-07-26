import { SubmissionState } from '@rspd/student-submissions/common/models';

export interface IProgressBar {

	/**
	 * Represents the current progress
	 */
	current: number;

	/**
	 * Represents the max progress which can be made
	 */
	total: number;

	/**
	 * Represents if an element has been completed
	 */
	state: SubmissionState;
}
