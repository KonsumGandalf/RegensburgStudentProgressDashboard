import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { BaseEntity } from '@rspd/shared/backend/utils';
import { Student } from '@rspd/user/backend/common-models';
import { Column, Entity, JoinColumn, ManyToOne, TableInheritance } from 'typeorm';

/**
 * Represents a Submission entity.
 *
 * @class
 * @extends BaseEntity
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Submission extends BaseEntity {
	/**
	 * Number of attempts made by the student for this submission.
	 *
	 * @type {number}
	 */

	@Column({ type: 'real' })
	completionPercentage: number;

	/**
	 * The student who submitted this submission.
	 *
	 * @type {Student}
	 */
	@ManyToOne(() => Student, (student: Student) => student.submissions)
	@JoinColumn()
	student: Student;

	/**
	 * The number of submission a user has done
	 *
	 * @type {Student}
	 */
	@Column({ type: 'int4', default: 1 })
	numberOfSubmissions: number;

	@ManyToOne(() => Assignment, (assignment: Assignment) => assignment.submissions)
	@JoinColumn()
	assignment: Assignment;
}
