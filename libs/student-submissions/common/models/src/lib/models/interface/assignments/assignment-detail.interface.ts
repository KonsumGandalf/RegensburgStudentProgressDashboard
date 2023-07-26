import { AssignmentType } from '@rspd/shared/backend/utils';
import { GithubTest } from '@rspd/student-submissions/backend/common-models';

import { IAssignmentOverview } from '../challenges/assignment-overview.interface';
import { IScoreOf } from '../score-of.interface';

/**
 * Represents the detailed information of an assignment.
 */
export interface IAssignmentDetail extends IAssignmentOverview {
	/**
	 * The targeted completion date of the assignment.
	 */
	targetedCompletionDate: Date;

	/**
	 * Score overview of all students.
	 */
	allStudents: IScoreOf;

	/**
	 * The URL for tutors' resources.
	 */
	tutorsUrl: URL;

	/**
	 * The URL for the submission platform f.e. Moodle or GitHub
	 */
	repositoryUrl: URL;

	/**
	 * The type of the assignment.
	 */
	assignmentType: AssignmentType;

	/**
	 * Array of GitHub tests in case it is a GitHub Submission.
	 */
	tests?: GithubTest[];
}
