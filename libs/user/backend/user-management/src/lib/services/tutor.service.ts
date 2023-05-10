import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutor, User } from '@rspd/user/backend/common-models';
import { Repository } from 'typeorm';

import { UserService } from './user.service';

/**
 * This service is dedicated to handle requests only available to a `Tutor`
 */
@Injectable()
export class TutorService extends UserService<Tutor> {
	constructor(
		@InjectRepository(Tutor)
		private readonly _tutorRepository: Repository<Tutor>,
	) {
		super(_tutorRepository);
	}

	/**
	 * Creates a new user.
	 * @async
	 * @param {IComplexUser} user - The user object to create.
	 * @returns {Promise<User>} The created user object.
	 */
	async createTutor(user: Tutor): Promise<Tutor> {
		return await super.create(user, [{ email: user.email }, { username: user.username }]);
	}
}
