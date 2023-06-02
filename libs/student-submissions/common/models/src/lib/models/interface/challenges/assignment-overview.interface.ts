import { AssignmentTopic } from '../../enums/assignment-topic';
import { SubmissionState } from '../../enums/submission-state';
import { IScoreOf } from '../score-of.interface';

export interface IAssignmentOverview {
	id: string;
	name: string;
	displayName: string;
	topics: AssignmentTopic[];
	completionState: SubmissionState;
	assignmentScore?: IScoreOf;
}
