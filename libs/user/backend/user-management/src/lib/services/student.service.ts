import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IComplexUser, Student, User } from '@rspd/user/backend/common-models';
import { Repository } from 'typeorm';

import { UserService } from './user.service';

/**
 * This service is dedicated to handle requests only available to a `Student`
 */
@Injectable()
export class StudentService extends UserService<Student> {
	constructor(
		@InjectRepository(Student)
		private readonly _studentRepository: Repository<Student>,
	) {
		super(_studentRepository);
	}

	/**
	 * Creates a new user.
	 * @async
	 * @param {IComplexUser} user - The user object to create.
	 * @returns {Promise<User>} The created user object.
	 */
	async createStudent(user: Student): Promise<Student> {
		return await super.create(user, [{ email: user.email }, { username: user.username }]);
	}

	async addMoodleIdToStudent(moodleId: number, email: string): Promise<Student> {
		const userId = await this.findOptions({
			where: {
				email,
			},
		}).then((user) => user.id);
		return await this.update(userId, { moodleId: moodleId } as Student);
	}

	async getStudentEagerly(username: string): Promise<Student> {
		return await this.findOptions({
			where: {
				username: username,
			} as Student,
			relations: ['githubUser', 'semester', 'email'],
		});
	}

	async updateStudent(id: string, updatedStudent: Student): Promise<Student> {
		const foundStudent = await super.findUser(id);
		console.log({
			...foundStudent,
			...updatedStudent,
		});
		return await super.update(id, {
			...foundStudent,
			...updatedStudent,
		});
	}
}
