import { SubmissionState } from '../enums/submission-state.enum';

/**
 * Calculates the submission state based on the number of assignments or tests  solved.
 * @param {number} solvedCount - The number of challenges solved.
 * @param {number} minCount - The minimum number of challenges required to be solved.
 * @param {number} totalCount - The total number of challenges.
 * @returns {SubmissionState} - The submission state.
 */
export function submissionStateCalculator(
	solvedCount: number,
	minCount: number,
	totalCount?: number,
): SubmissionState {
	if (totalCount && solvedCount >= totalCount) {
		return SubmissionState.CompletelySolved;
	} else if (solvedCount >= minCount) {
		return SubmissionState.Solved;
	} else {
		return SubmissionState.Unsolved;
	}
}
