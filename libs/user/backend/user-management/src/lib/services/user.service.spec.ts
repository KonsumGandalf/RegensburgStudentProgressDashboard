import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { Mail, Student, User } from '@rspd/user/backend/common-models';

import { StudentService } from './student.service';
import { UserService } from './user.service';

describe('UserService', () => {
	let service: UserService;
	let users: User[];
	let userRepository: MockRepository<User>;
	let students: Student[];
	let studentRepository: MockRepository<Student>;
	let testUser: User;

	beforeEach(async () => {
		users = [];
		for (let i = 0; i < 3; i++) {
			const email = {
				email: faker.internet.email(),
				isEmailValidated: false,
			} as Mail;
			users.push({
				email: email,
				username: faker.internet.userName(),
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
			} as User);
		}
		testUser = users[1];

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				StudentService,
				{
					provide: getRepositoryToken(Student),
					useClass: MockRepository,
				},
				{
					provide: getRepositoryToken(User),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(UserService);
		userRepository = module.get(getRepositoryToken(User));
		userRepository.entities = users;
		studentRepository = module.get(getRepositoryToken(Student));
		studentRepository.entities = students;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('findUserByEmail', () => {
		it('should find a user by email address', async () => {
			const result = await service.findUserByEmail(testUser.email);

			expect(result).toEqual(testUser);
		});
	});

	describe('findUserByUsername', () => {
		it('should find a user by username', async () => {
			const result = await service.findUserByUsername(testUser.username);

			expect(result).toEqual(testUser);
		});
	});
});
