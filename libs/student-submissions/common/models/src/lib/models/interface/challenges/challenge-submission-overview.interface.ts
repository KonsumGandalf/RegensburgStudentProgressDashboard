import { SubmissionState } from '../../enums/submission-state';
import { IScoreOf } from '../score-of.interface';
import { IAssignmentOverview } from './assignment-overview.interface';

export interface IChallengeSubmissionOverview {
	name: string;
	targetedCompletionDate: Date;
	completionState: SubmissionState;
	assignments: IAssignmentOverview[];
	challengeScore: IScoreOf;
}
