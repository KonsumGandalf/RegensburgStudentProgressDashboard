import { SubmissionState } from '../enums/submission-state.enum';
import { submissionStateCalculator } from './submission-state-calculator';

describe('submissionStateCalculator', () => {
	it('should return "CompletelySolved" if solvedCount equals totalCount', () => {
		const state = submissionStateCalculator(5, 5, 5);
		expect(state).toBe(SubmissionState.CompletelySolved);
	});

	it('should return "Solved" if solvedCount is greater than or equal to minCount', () => {
		const state = submissionStateCalculator(3, 2, 5);
		expect(state).toBe(SubmissionState.Solved);
	});

	it('should return "Unsolved" if solvedCount is less than minCount', () => {
		const state = submissionStateCalculator(1, 2, 5);
		expect(state).toBe(SubmissionState.Unsolved);
	});

	it('should return "CompletelySolved" if totalCount is not provided and solvedCount equals minCount', () => {
		const state = submissionStateCalculator(2, 2);
		expect(state).toBe(SubmissionState.Solved);
	});

	it('should return "Solved" if totalCount is not provided and solvedCount is greater than or equal to minCount', () => {
		const state = submissionStateCalculator(3, 2);
		expect(state).toBe(SubmissionState.Solved);
	});

	it('should return "Unsolved" if totalCount is not provided and solvedCount is less than minCount', () => {
		const state = submissionStateCalculator(1, 2);
		expect(state).toBe(SubmissionState.Unsolved);
	});
});
