import { AssignmentTopic, AssignmentType, BaseEntity } from '@rspd/shared/backend/utils';
import { AssignmentSubmission } from '@rspd/student-submissions/backend/common-models';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, TableInheritance } from 'typeorm';

import { Challenge } from './challenge.entity';

/**
 * Represents an assignment entity.
 * @class
 * @extends BaseEntity
 */
@Entity()
@TableInheritance({ column: 'type' })
export class Assignment extends BaseEntity {
	/**
	 * The unique name of the assignment.
	 * @type {string}
	 */
	@Column({ unique: true })
	name: string;

	/**
	 * The name of the assignment which is displayed
	 * @type {string}
	 */
	@Column()
	displayName: string;

	/**
	 * The type of the assignment.
	 * @type {AssignmentType}
	 */
	@Column({ type: 'enum', enum: AssignmentType })
	type: AssignmentType;

	/**
	 * The ID of the challenge the assignment belongs to.
	 * @type {string}
	 */
	@Column()
	challengeId: string;

	/**
	 * The challenge the assignment belongs to.
	 * @type {Challenge}
	 */
	@ManyToOne(() => Challenge, (challenge) => challenge.assignments)
	challenge: Challenge;

	/**
	 * The topics associated with the assignment.
	 * @type {AssignmentTopic[]}
	 */
	@Column({ type: 'enum', enum: AssignmentTopic, array: true })
	topics: AssignmentTopic[];

	/**
	 * The URL of the repository for the assignment.
	 * @type {URL}
	 *
	 * @example https://github.com/
	 */
	@Column({ type: 'varchar' })
	repositoryUrl: string;

	/**
	 * The URL of the tutors for the assignment.
	 *
	 * @type {URL}
	 *
	 * @example https://reader.tutors.dev/
	 */
	@Column({ type: 'varchar' })
	tutorsUrl: URL;

	/**
	 * The submissions associated with the assignment
	 *
	 * @type {UnionAssignment[]}
	 */
	@OneToMany(
		() => AssignmentSubmission,
		(submission: AssignmentSubmission) => submission.assignment,
	)
	@JoinColumn()
	submissions: AssignmentSubmission[];
}
