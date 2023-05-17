import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericRepositoryService, UserRole } from '@rspd/shared/backend/utils';
import { IComplexUser, IEmail, Student, User } from '@rspd/user/backend/common-models';
import { Repository } from 'typeorm';

@Injectable()
export class UserService<UserType extends User = User> extends GenericRepositoryService<
	UserType,
	IComplexUser
> {
	constructor(@InjectRepository(User) private readonly _userRepository: Repository<UserType>) {
		super(_userRepository);
	}

	/**
	 * Finds a user by email address.
	 * @async
	 * @param {string} email - The email address to search for.
	 * @returns {Promise<IComplexUser>} The user object found by email address.
	 */
	async findUserByEmail(email: IEmail) {
		return await super.findOptions({
			where: { email },
			relations: ['email'],
		});
	}

	/**
	 * Finds a user by username.
	 * @async
	 * @param {string} username - The username to search for.
	 * @param {boolean} [relations=false] - Whether to include email relations.
	 * @returns {Promise<User>} The user object found by username.
	 */
	async findUserByUsername(username: string) {
		return await super.findOptions({
			where: { username },
			relations: ['email'],
		});
	}

	/**
	 * Finds a user by ID.
	 * @async
	 * @param {string} id - The ID of the user to search for.
	 * @param {boolean} [relations=false] - Whether to include email relations.
	 * @returns {Promise<IComplexUser>} The user object found by ID.
	 */
	async findUser(id: string) {
		return await super.findOptions({
			where: { id },
			relations: ['email'],
		});
	}

	async findAllStudents(): Promise<User[]> {
		return await this.findOptionsMany({
			where: {
				role: UserRole.STUDENT,
			} as Student,
		});
	}
}
