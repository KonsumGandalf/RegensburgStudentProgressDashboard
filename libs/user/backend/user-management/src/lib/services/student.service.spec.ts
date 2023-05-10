import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { DuplicateSourceException } from '@rspd/shared/backend/utils';
import { Mail, Student } from '@rspd/user/backend/common-models';

import { StudentService } from './student.service';

describe('StudentService', () => {
	let service: StudentService;
	const students: Student[] = [];
	let studentRepository: MockRepository<Student>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StudentService,
				{
					provide: getRepositoryToken(Student),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(StudentService);
		studentRepository = module.get(getRepositoryToken(Student));
		studentRepository.entities = students;
	});

	describe('create', () => {
		let student: Student;
		beforeEach(() => {
			student = {
				firstName: 'John',
				lastName: 'Doe',
				email: {
					email: 'test@mai.com',
					isEmailValidated: false,
				} as Mail,
				username: 'test-user',
				hashedPassword: 'secret',
			} as Student;
			studentRepository.entities = [];
		});

		it('should create a new user', async () => {
			const saveSpy = jest.spyOn(studentRepository, 'save').mockResolvedValueOnce(student);

			const result = await service.create(student);

			expect(result).toMatchObject(student);
			expect(saveSpy).toHaveBeenCalledWith(student);
		});

		it('should throw a `DuplicateSourceException` when a user with the same username is created', async () => {
			await service.createStudent(student);

			await expect(service.createStudent(student)).rejects.toThrowError(
				DuplicateSourceException,
			);
		});

		it('should throw a `DuplicateSourceException` when a user with the same email is created', async () => {
			await service.createStudent(student);

			student.username = 'different-username';

			await expect(service.createStudent(student)).rejects.toThrowError(
				DuplicateSourceException,
			);
		});
	});
});
