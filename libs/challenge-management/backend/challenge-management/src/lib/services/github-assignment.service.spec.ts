import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
	Challenge,
	GithubAssignment,
	Semester,
} from '@rspd/challenge-management/backend/common-models';
import { SemesterService } from '@rspd/challenge-management/backend/semester-management';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { AssignmentTopic, AssignmentType } from '@rspd/shared/backend/utils';

import { GithubAssignmentDto } from '../models/dto/github-assignment.dto';
import { GithubAssignmentService } from './github-assignment.service';

describe('GithubAssignmentService', () => {
	let service: GithubAssignmentService;
	let assignmentRepository: MockRepository<GithubAssignment>;
	const assignments: GithubAssignment[] = [];
	let fakeSemester: Semester;

	beforeEach(async () => {
		fakeSemester = {
			id: 'random-semester',
			start: new Date(),
		} as Semester;

		for (let i = 0; i < 2; i++) {
			const testAssignment = {
				id: faker.datatype.number({ min: 0, max: 200 }).toString(),
				name: faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
				type: faker.helpers.arrayElement(Object.values(AssignmentType)),
				topics: [faker.helpers.arrayElement(Object.values(AssignmentTopic))],
				repositoryUrl: faker.internet.url(),
				tutorsUrl: new URL(faker.internet.url()),
				minPassedTests: faker.datatype.number({ min: 5, max: 15 }),
				totalTests: faker.datatype.number({ min: 10, max: 20 }),
				challenge: {
					semester: fakeSemester,
				},
			} as GithubAssignment;
			assignments.push(testAssignment);
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GithubAssignmentService,
				{
					provide: getRepositoryToken(GithubAssignment),
					useClass: MockRepository,
				},
				{
					provide: SemesterService,
					useValue: {
						getCurrentSemester: jest.fn().mockResolvedValue(fakeSemester),
					},
				},
			],
		}).compile();

		service = module.get(GithubAssignmentService);
		assignmentRepository = module.get<MockRepository<GithubAssignment>>(
			getRepositoryToken(GithubAssignment),
		);
		assignmentRepository.entities = assignments;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('createAssignment', () => {
		it('should create and return the saved assignment entity', async () => {
			const challenge = {
				id: 'challenge-id',
			} as Challenge;
			const assignmentDto = {
				displayName: 'Mario 1',
				type: faker.helpers.arrayElement(Object.values(AssignmentType)),
				topics: [faker.helpers.arrayElement(Object.values(AssignmentTopic))],
				repositoryUrl: new URL(faker.internet.url()).toString(),
				tutorsUrl: new URL(faker.internet.url()),
				minPassedTests: faker.datatype.number({ min: 5, max: 15 }),
				totalTests: faker.datatype.number({ min: 10, max: 20 }),
			} as GithubAssignmentDto;

			const createdAssignment = await service.createAssignment(challenge, assignmentDto);

			expect(createdAssignment).toMatchObject({
				...assignmentDto,
				displayName: assignmentDto.displayName,
				name: 'mario-1',
			});
		});
	});

	describe('getAssignmentByRepositoryUrl', () => {
		it('should return the Assignment by the given repositoryUrl', async () => {
			const assignment = await service.getAssignmentByRepositoryUrl(
				assignments[0].repositoryUrl,
			);

			expect(assignment).toEqual(assignments[0]);
		});
	});

	describe('updateAssignment', () => {
		let toUpdateElement: GithubAssignment;
		let updateDto: GithubAssignmentDto;

		beforeEach(() => {
			toUpdateElement = assignments[0];
			updateDto = {
				...toUpdateElement,
				displayName: 'Changed Name',
				totalTests: 12,
			} as GithubAssignmentDto;
			toUpdateElement.totalTests = 12;
			toUpdateElement.displayName = 'Changed Name';
			toUpdateElement.name = 'changed-name';
		});

		it('should update the assignment with the given ID', async () => {
			const response = await service.updateAssignment(toUpdateElement.id, updateDto);

			expect(response).toEqual(toUpdateElement);
		});

		it('should throw an `ConflictException` if the Assignment with the given ID could not be updated', async () => {
			const id = '201';

			await expect(() => service.updateAssignment(id, updateDto)).rejects.toThrow(
				ConflictException,
			);
		});
	});
});
