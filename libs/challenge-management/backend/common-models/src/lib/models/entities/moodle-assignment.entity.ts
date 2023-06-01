import { AssignmentType } from '@rspd/shared/backend/utils';
import {
	GithubSubmission,
	MoodleSubmission,
} from '@rspd/student-submissions/backend/common-models';
import { ChildEntity, Column, JoinColumn, OneToMany } from 'typeorm';

import { Assignment } from './assignment.entity';

@ChildEntity(AssignmentType.MOODLE)
export class MoodleAssignment extends Assignment {
	@Column()
	moodleCourseId: number;

	@Column()
	moodleAssignmentId: number;

	/**
	 * The submissions associated with the assignment
	 *
	 * @type {UnionAssignment[]}
	 */
	@OneToMany(() => MoodleSubmission, (submission: MoodleSubmission) => submission.assignment)
	@JoinColumn()
	override submissions: MoodleSubmission[];
}
