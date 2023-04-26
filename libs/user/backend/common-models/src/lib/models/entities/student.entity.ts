import { GithubUser, UserRole } from '@rspd/shared/backend/utils';
import { Submission } from '@rspd/student-submissions/backend/common-models';
import { ChildEntity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { User } from './user.entity';

/**
 * Represents a student entity
 *
 * @class Student
 *
 * @extends {User}
 */
@ChildEntity(UserRole.STUDENT)
export class Student extends User {
	/**
	 * The account of the linked user
	 *
	 * @type {GithubUser}
	 */
	@OneToOne(() => GithubUser)
	@JoinColumn()
	githubUser: GithubUser;

	/**
	 * The submissions made by the student
	 *
	 * @type {Submission[]}
	 * @memberof Student
	 */
	@OneToMany(() => Submission, (submission: Submission) => submission.student)
	@JoinColumn()
	submissions: Submission[];
}
