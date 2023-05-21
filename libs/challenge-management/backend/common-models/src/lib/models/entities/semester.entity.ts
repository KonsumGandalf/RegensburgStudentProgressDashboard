import { Challenge } from '@rspd/challenge-management/backend/common-models';
import { BaseEntity } from '@rspd/shared/backend/utils';
import { Student } from '@rspd/user/backend/common-models';
import { Column, Entity, OneToMany } from 'typeorm';

/**
 * Represents a semester entity.
 */
@Entity()
export class Semester extends BaseEntity {
	/**
	 * The start date of the semester.
	 * @type {Date}
	 */
	@Column({ type: 'timestamptz' })
	start;

	/**
	 * The end date of the semester.
	 * @type {Date}
	 */
	@Column({ type: 'timestamptz' })
	end;

	/**
	 * The unique name of the semester.
	 * @type {string}
	 */
	@Column({ unique: true })
	name;

	/**
	 * The challenges associated with the semester.
	 * @type {Challenge[]}
	 */
	@OneToMany(() => Challenge, (challenge) => challenge.semester)
	challenges;

	/**
	 * The students enrolled in the semester.
	 * @type {Student[]}
	 */
	@OneToMany(() => Student, (student) => student.semester)
	students;
}
