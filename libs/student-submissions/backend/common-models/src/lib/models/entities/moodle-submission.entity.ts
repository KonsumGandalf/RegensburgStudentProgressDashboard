import { MoodleAssignment } from '@rspd/challenge-management/backend/common-models';
import { AssignmentType } from '@rspd/shared/backend/utils';
import { ChildEntity, JoinColumn, ManyToOne } from 'typeorm';

import { AssignmentSubmission } from './assignment-submission.entity';

@ChildEntity(AssignmentType.MOODLE)
export class MoodleSubmission extends AssignmentSubmission {
	/**
	 * The assignment a submissions is done for.
	 *
	 * @type {MoodleAssignment}
	 */
	@ManyToOne(() => MoodleAssignment, (assignment: MoodleAssignment) => assignment.submissions)
	@JoinColumn()
	override assignment: MoodleAssignment;
}
