import { AssignmentTopic } from '@rspd/shared/backend/utils';
import { SubmissionState } from '@rspd/student-submissions/backend/common-models';

import { IScoreOf } from '../score-of.interface';

export interface IAssignmentOverview {
	id: string;
	name: string;
	displayName: string;
	topics: AssignmentTopic[];
	completionState: SubmissionState;
	assignmentScore?: IScoreOf;
}
