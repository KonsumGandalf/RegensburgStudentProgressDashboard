import { Challenge } from '@rspd/challenge-management/backend/common-models';
import { UserRole } from '@rspd/shared/backend/utils';
import { ChildEntity, JoinColumn, OneToMany } from 'typeorm';

import { User } from './user.entity';

/**
 * Represents a tutor entity which can be a supporting academic or a professor
 *
 * @class Tutor
 *
 * @extends {User}
 */
@ChildEntity(UserRole.TUTOR)
export class Tutor extends User {
	/**
	 * The challenges created by the tutors
	 *
	 * @type {Challenge[]}
	 * @memberof Challenge
	 */
	@OneToMany(() => Challenge, (challenge: Challenge) => challenge.tutor)
	@JoinColumn()
	challenges: Challenge[];
}
