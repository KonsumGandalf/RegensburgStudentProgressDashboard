import { Challenge } from '@rspd/challenge-management/backend/common-models';
import { BaseEntity } from '@rspd/shared/backend/utils';
import { Student } from '@rspd/user/backend/common-models';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AssignmentSubmission } from './assignment-submission.entity';
import { BaseSubmission } from './base-submission.entity';

/**
 * Represents a student submission for a challenge and indicates if a challenge has been completed
 */
@Entity()
export class ChallengeSubmission extends BaseSubmission {
	/**
	 * The challenge for which the single submissions are made.
	 *
	 * @type {Challenge}
	 */
	@ManyToOne(() => Challenge, (challenge: Challenge) => challenge.submissions)
	@JoinColumn()
	challenge: Challenge;

	/**
	 * The student who submitted to this challenge.
	 *
	 * @type {Student}
	 */
	@ManyToOne(() => Student, (student: Student) => student.challengeSubmissions)
	@JoinColumn()
	student: Student;

	/**
	 * The submissions made by the student for the challenge.
	 *
	 * @type {AssignmentSubmission[]}
	 */
	@OneToMany(
		() => AssignmentSubmission,
		(submission: AssignmentSubmission) => submission.challengeSubmission,
	)
	submissions: AssignmentSubmission[];
}
