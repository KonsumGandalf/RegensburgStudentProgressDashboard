import { Assignment, UnionAssignment } from '@rspd/challenge-management/backend/common-models';
import { Student } from '@rspd/user/backend/common-models';
import { Column, Entity, JoinColumn, ManyToOne, TableInheritance } from 'typeorm';

import { BaseSubmission } from './base-submission.entity';
import { ChallengeSubmission } from './challenge-submission.entity';

/**
 * Represents a submission a student does for an assignment.
 *
 * @class
 * @extends BaseEntity
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class AssignmentSubmission extends BaseSubmission {
	/**
	 * The student who submitted this submit.
	 *
	 * @type {Student}
	 */
	@ManyToOne(() => Student, (student: Student) => student.assignmentSubmissions)
	@JoinColumn()
	student: Student;

	/**
	 * The number of submit a user has done
	 *
	 * @type {Student}
	 */
	@Column({ type: 'int4', default: 1 })
	numberOfSubmissions: number;

	/**
	 * The assignment a submissions is done for.
	 *
	 * @type {Assignment}
	 */
	@ManyToOne(() => Assignment, (assignment: Assignment) => assignment.submissions)
	@JoinColumn()
	assignment: UnionAssignment;

	/**
	 * The submission of which the assignment submission is part of.
	 *
	 * @type {ChallengeSubmission}
	 */
	@ManyToOne(
		() => ChallengeSubmission,
		(challengeSubmission: ChallengeSubmission) => challengeSubmission.submissions,
	)
	@JoinColumn()
	challengeSubmission: ChallengeSubmission;
}
