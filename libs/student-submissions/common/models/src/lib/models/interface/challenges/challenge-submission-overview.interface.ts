import { SubmissionState } from '@rspd/student-submissions/backend/common-models';

import { IScoreOf } from '../score-of.interface';
import { IAssignmentOverview } from './assignment-overview.interface';

export interface IChallengeSubmissionOverview {
	name: string;
	targetedCompletionDate: Date;
	completionState: SubmissionState;
	assignments: IAssignmentOverview[];
	challengeScore: IScoreOf;
}
