import { SubmissionState } from '@rspd/student-submissions/common/models';

export const COMPLETION_COLOR_MAP = {
	[SubmissionState.CompletelySolved]: 'full-success',
	[SubmissionState.Solved]: 'medium-success',
	[SubmissionState.Unsolved]: 'themed-black',
}
