import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
	Assignment,
	Challenge,
	GithubAssignment,
	MoodleAssignment,
} from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { AssignmentTopic, AssignmentType, IDeleteResponse } from '@rspd/shared/backend/utils';

import { CreateChallengeDto } from '../models/dto/create-challenge.dto';
import { GithubAssignmentDto } from '../models/dto/github-assignment.dto';
import { MoodleAssignmentDto } from '../models/dto/moodle-assignment.dto';
import { AssignmentService } from './assignment.service';
import { GithubAssignmentService } from './github-assignment.service';
import { MoodleAssignmentService } from './moodle-assignment.service';

describe('AssignmentService', () => {
	let service: AssignmentService;
	let moodleAssignmentService: MoodleAssignmentService;
	let githubAssignmentService: GithubAssignmentService;
	let assignmentRepository: MockRepository<Assignment>;
	const assignments: Assignment[] = [];

	beforeEach(async () => {
		for (let i = 0; i < 2; i++) {
			const testAssignment = {
				id: faker.datatype.number({ min: 0, max: 200 }).toString(),
				name: faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
				type: faker.helpers.arrayElement(Object.values(AssignmentType)),
				topics: [faker.helpers.arrayElement(Object.values(AssignmentTopic))],
				repositoryUrl: faker.internet.url().toString(),
				tutorsUrl: new URL(faker.internet.url()),
			} as Assignment;
			assignments.push(testAssignment);
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssignmentService,
				{
					provide: getRepositoryToken(Assignment),
					useClass: MockRepository,
				},
				{
					provide: MoodleAssignmentService,
					useValue: {
						createAssignment: jest.fn().mockImplementation((args) => args),
						updateAssignment: jest.fn().mockImplementation((args) => args),
					},
				},
				{
					provide: GithubAssignmentService,
					useValue: {
						createAssignment: jest.fn().mockImplementation((args) => args),
						updateAssignment: jest.fn().mockImplementation((args) => args),
					},
				},
			],
		}).compile();

		service = module.get<AssignmentService>(AssignmentService);
		moodleAssignmentService = module.get(MoodleAssignmentService);
		githubAssignmentService = module.get(GithubAssignmentService);
		assignmentRepository = module.get<MockRepository<Assignment>>(
			getRepositoryToken(Assignment),
		);
		assignmentRepository.entities = assignments;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('getAssignmentByName', () => {
		it('should return the assignment for its name', async () => {
			const receivedAssignment = await service.getAssignmentByName(assignments[1].name);

			expect(receivedAssignment).toMatchObject(assignments[1]);
		});
	});

	describe('getAssignmentById', () => {
		it('should return the Assignment with the given ID', async () => {
			const assignment = await service.getAssignmentById(assignments[0].id);

			expect(assignment).toEqual(assignments[0]);
		});

		it('should throw an `NotFoundException` if the Assignment with the given ID is not found', async () => {
			const id = '201';

			await expect(() => service.getAssignmentById(id)).rejects.toThrow(NotFoundException);
		});
	});

	describe('getAssignmentByName', () => {
		it('should return the Assignment with the given ID', async () => {
			const assignment = await service.getAssignmentByName(assignments[0].name);

			expect(assignment).toEqual(assignments[0]);
		});
	});

	describe('getAssignmentByChallengeId', () => {
		it('should return the Assignment with the given ID', async () => {
			assignments[0].challengeId = 'true';
			const foundAssignments = await service.getAssignmentByChallengeId(
				assignments[0].challengeId,
			);

			expect(foundAssignments).toEqual([assignments[0]]);
		});
	});

	describe('deleteAssignment', () => {
		let toDeleteElement: Assignment;
		beforeEach(async () => {
			toDeleteElement = assignments[0] as Assignment;
		});

		it('should delete the assignment with the given ID', async () => {
			const expectedResponse = {
				deletedElements: toDeleteElement,
			} as IDeleteResponse<Assignment>;

			const response = await service.deleteAssignment(toDeleteElement.id);

			expect(response).toMatchObject(expectedResponse);
		});

		it('should throw an `ConflictException` if the Assignment with the given ID could not be deleted', async () => {
			const id = '201';

			await expect(() => service.deleteAssignment(id)).rejects.toThrow(ConflictException);
		});
	});

	describe('getChallengeByAssignmentId', () => {
		it('should return the connected challenge of an assignment', async () => {
			const fakeAssignment = {
				...assignments[0],
				challenge: {
					id: 'random-id',
				},
			} as Assignment;
			const functionSpy = jest
				.spyOn(service, 'findOptions')
				.mockResolvedValueOnce(fakeAssignment);

			const receivedChallenge = await service.getChallengeByAssignmentId(fakeAssignment.id);

			expect(functionSpy).toHaveBeenCalledTimes(1);
			expect(receivedChallenge).toEqual(fakeAssignment.challenge);
		});
	});

	describe('updateAssignment', () => {
		it('should forward the update to the GithubAssignmentService', async () => {
			const fakeAssignment = {
				id: 'test',
				type: AssignmentType.GITHUB,
			} as GithubAssignment;

			const result = await service.updateAssignment(fakeAssignment.id, fakeAssignment);

			expect(moodleAssignmentService.updateAssignment).toHaveBeenCalledTimes(0);
			expect(githubAssignmentService.updateAssignment).toHaveBeenCalledTimes(1);
			expect(result).toBeDefined();
		});

		it('should forward the update to the MoodleAssignmentService', async () => {
			const fakeAssignment = {
				id: 'test',
				type: AssignmentType.MOODLE,
			} as MoodleAssignment;

			const result = await service.updateAssignment(fakeAssignment.id, fakeAssignment);

			expect(moodleAssignmentService.updateAssignment).toHaveBeenCalledTimes(1);
			expect(githubAssignmentService.updateAssignment).toHaveBeenCalledTimes(0);
			expect(result).toBeDefined();
		});
	});

	describe('createAssignment', () => {
		it('should forward the update to the GithubAssignmentService', async () => {
			const fakeAssignment = {
				type: AssignmentType.GITHUB,
			} as GithubAssignmentDto;
			const challenge = {} as Challenge;
			const challengeDto = {} as CreateChallengeDto;

			const result = await service.createAssignment(challenge, fakeAssignment, challengeDto);

			expect(moodleAssignmentService.createAssignment).toHaveBeenCalledTimes(0);
			expect(githubAssignmentService.createAssignment).toHaveBeenCalledTimes(1);
			expect(result).toBeDefined();
		});

		it('should forward the update to the MoodleAssignmentService', async () => {
			const fakeAssignment = {
				type: AssignmentType.MOODLE,
			} as MoodleAssignmentDto;
			const challenge = {} as Challenge;
			const challengeDto = {} as CreateChallengeDto;

			const result = await service.createAssignment(challenge, fakeAssignment, challengeDto);

			expect(moodleAssignmentService.createAssignment).toHaveBeenCalledTimes(1);
			expect(githubAssignmentService.createAssignment).toHaveBeenCalledTimes(0);
			expect(result).toBeDefined();
		});
	});
});
