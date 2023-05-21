import { Semester } from '@rspd/challenge-management/backend/common-models';
import { GithubUser, UserRole } from '@rspd/shared/backend/utils';
import { AssignmentSubmission } from '@rspd/student-submissions/backend/common-models';
import { ChallengeSubmission } from '@rspd/student-submissions/backend/common-models';
import { ChildEntity, Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

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
	 * @type {AssignmentSubmission[]}
	 * @memberof Student
	 */
	@OneToMany(() => AssignmentSubmission, (submission: AssignmentSubmission) => submission.student)
	@JoinColumn()
	assignmentSubmissions: AssignmentSubmission[];

	/**
	 * The submissions which are target a challenge and summarized single assignmentSubmissions
	 *
	 * @type {ChallengeSubmission[]}
	 * @memberof Student
	 */
	@OneToMany(() => ChallengeSubmission, (submission: ChallengeSubmission) => submission.student)
	@JoinColumn()
	challengeSubmissions: ChallengeSubmission[];

	/**
	 * The external id of a user in the Moodle
	 */
	@Column({ nullable: true })
	moodleId?: number;

	/**
	 * The assigned semester of the student
	 */
	@ManyToOne(() => Semester, (semester: Semester) => semester.students)
	semester: Semester;
}
