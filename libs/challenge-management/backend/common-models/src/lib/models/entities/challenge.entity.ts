import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { BaseEntity } from '@rspd/shared/backend/utils';
import { ChallengeSubmission } from '@rspd/student-submissions/backend/common-models';
import { Tutor } from '@rspd/user/backend/common-models';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

/**
 * Represents a challenge that a user can complete.
 * @class
 * @extends BaseEntity
 * @name Challenge
 */
@Entity()
export class Challenge extends BaseEntity {
	/**
	 * The name of the challenge.
	 *
	 * @member {string}
	 */
	@Column()
	name: string;

	/**
	 * The date when the challenge is targeted to be completed.
	 * @member {Date}
	 */
	@Column({ type: 'timestamptz' })
	targetedCompletionDate: Date;

	/**
	 * The list of assignments associated with this challenge.
	 *
	 * @type {Assignment[]}
	 */
	@OneToMany(() => Assignment, (assignment) => assignment.challenge)
	assignments: Assignment[];

	/**
	 * The tutor who created this challenge.
	 *
	 * @type {Tutor}
	 */
	@ManyToOne(() => Tutor, (tutor: Tutor) => tutor.challenges)
	tutor: Tutor;

	/**
	 * The challenge submission which states if a submission has been completed
	 *
	 * @type {Assignment[]}
	 */
	@OneToMany(
		() => ChallengeSubmission,
		(challengeSubmission: ChallengeSubmission) => challengeSubmission.challenge,
	)
	submissions: ChallengeSubmission[];
}
