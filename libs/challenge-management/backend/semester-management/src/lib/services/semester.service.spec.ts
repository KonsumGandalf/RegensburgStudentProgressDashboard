import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Semester } from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';

import { SemesterService } from './semester.service';
import spyOn = jest.spyOn;

describe('SemesterService', () => {
	let service: SemesterService;
	let semesterRepository: MockRepository;
	let fakeSemester: Semester[];

	beforeEach(async () => {
		fakeSemester = [];

		for (let i = 0; i < 2; i++) {
			fakeSemester.push({
				id: faker.datatype.number({ min: 0, max: 200 }).toString(),
				name: 'test',
				start: faker.date.past(),
				end: faker.date.future(),
			} as Semester);
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SemesterService,
				{
					provide: getRepositoryToken(Semester),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(SemesterService);
		semesterRepository = module.get(getRepositoryToken(Semester));
		semesterRepository.entities = fakeSemester;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('createSemester', () => {
		it('should create the correct semester name for winter semester', async () => {
			const semester = {
				start: new Date('2023-09-01'),
				end: new Date('2024-02-29'),
			};

			const result = await service.createSemester(semester);
			expect(result.name).toBe('WS-2023');
		});

		it('should create the correct semester name for summer semester', async () => {
			const semester = {
				start: new Date('2024-03-01'),
				end: new Date('2024-08-31'),
			};

			const result = await service.createSemester(semester);
			expect(result.name).toBe('SS-2024');
		});

		it('should return undefined for invalid semester', async () => {
			const semester = {
				start: new Date('2024-08-01'),
				end: new Date('2025-08-31'),
			};

			const result = await service.createSemester(semester);
			expect(result.name).toBeUndefined();
		});
	});

	describe('updateSemester', () => {
		it('should correctly update the semester', async () => {
			spyOn(service, 'findByName').mockResolvedValue(fakeSemester[0]);
			const expectedDto = {
				start: new Date(),
				end: new Date(),
			};
			const result = await service.updateSemester('test-2', expectedDto);

			expect(result).toMatchObject(expectedDto);
		});
	});

	describe('getCurrentSemester', () => {
		it('should find no current Semester if there was not semester created yet', async () => {
			jest.spyOn(service, 'findAll').mockResolvedValue([]);

			const result = await service.getCurrentSemester();

			expect(result).toBeUndefined();
		});
		it('should find the correct current Semester', async () => {
			jest.spyOn(service, 'findAll').mockResolvedValue([
				{
					start: new Date('2022-09-01'),
					end: new Date('2023-03-01'),
				} as Semester,
				{
					start: new Date('2023-03-01'),
					end: new Date('2023-09-01'),
				} as Semester,
				{
					start: new Date('2023-09-01'),
					end: new Date('2024-03-01'),
				} as Semester,
			]);

			const result = await service.getCurrentSemester();

			expect(result).toMatchObject({
				start: new Date('2023-03-01'),
				end: new Date('2023-09-01'),
			} as Semester);
		});
		it('should find no current Semester if non is suitable', async () => {
			jest.spyOn(service, 'findAll').mockResolvedValue([
				{
					start: new Date('2022-09-01'),
					end: new Date('2023-03-01'),
				} as Semester,
				{
					start: new Date('2023-09-01'),
					end: new Date('2024-03-01'),
				} as Semester,
			]);

			const result = await service.getCurrentSemester();

			expect(result).toBeUndefined();
		});
	});
});
