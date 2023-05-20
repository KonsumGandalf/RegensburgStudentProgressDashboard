import { AssignmentType } from '@rspd/shared/backend/utils';
import { ChildEntity, Column } from 'typeorm';

import { Assignment } from './assignment.entity';

@ChildEntity(AssignmentType.MOODLE)
export class MoodleAssignment extends Assignment {
	@Column()
	moodleCourseId: number;

	@Column()
	moodleAssignmentId: number;
}
