import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { Challenge } from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';
import {
	ActionNotPerformedException,
	AssignmentTopic,
	AssignmentType,
	IDeleteResponse,
} from '@rspd/shared/backend/utils';

import { CreateChallengeDto } from '../models/dto/create-challenge.dto';
import { AssignmentService } from './assignment.service';
import { ChallengeService } from './challenge.service';

describe('ChallengeService', () => {
	let service: ChallengeService;
	let challengeRepository: MockRepository;
	let testChallenge: Challenge;
	let challenges: Challenge[];
	let assignmentsRepository: MockRepository;
	let assignments: Assignment[];

	beforeEach(async () => {
		challenges = [];
		assignments = [];
		for (let i = 0; i < 2; i++) {
			const challenge = {
				id: faker.datatype.number({ min: 0, max: 200 }).toString(),
				name: faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
				assignments: [],
			} as Challenge;
			for (let i = 0; i < 2; i++) {
				const testAssignment = {
					id: faker.datatype.number({ min: 0, max: 200 }).toString(),
					name: faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
					type: faker.helpers.arrayElement(Object.values(AssignmentType)),
					topics: [faker.helpers.arrayElement(Object.values(AssignmentTopic))],
					repositoryUrl: faker.internet.url(),
					tutorsUrl: faker.internet.url(),
					minPassedTests: faker.datatype.number({ min: 5, max: 15 }),
					totalTests: faker.datatype.number({ min: 10, max: 20 }),
					challengeId: challenge.id,
				} as unknown as Assignment;
				challenge.assignments.push(testAssignment);
				assignments.push(testAssignment);
			}
			challenges.push(challenge);
		}
		testChallenge = challenges[0];

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ChallengeService,
				AssignmentService,
				{
					provide: getRepositoryToken(Challenge),
					useClass: MockRepository,
				},
				{
					provide: getRepositoryToken(Assignment),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(ChallengeService);
		challengeRepository = module.get(getRepositoryToken(Challenge));
		challengeRepository.entities = challenges;
		assignmentsRepository = module.get(getRepositoryToken(Assignment));
		assignmentsRepository.entities = assignments;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('createChallenge', () => {
		it('should create and return the saved challenge entity', async () => {
			const challengeDto: CreateChallengeDto = { ...testChallenge };
			const createdChallenge = await service.createChallengeAndAssignments(challengeDto);

			expect(createdChallenge.name).toEqual(testChallenge.name);
			expect(createdChallenge.targetedCompletionDate).toEqual(
				testChallenge.targetedCompletionDate,
			);
		});
	});

	describe('getChallenge', () => {
		it('should return a challenge by id without assignments', async () => {
			const result = await service.getChallenge(testChallenge.id);

			expect(result).toEqual(testChallenge);
		});

		it('should throw a NoContentException if no challenge is found', async () => {
			const challengeId = 'wrong';

			await expect(service.getChallenge(challengeId)).rejects.toThrow(NotFoundException);
		});
	});

	describe('deleteChallengeAndAssignment', () => {
		it('should delete the challenge and its associated assignments and return the affected rows and deleted elements', async () => {
			const affectedAssignments = (await service.getChallenge(testChallenge.id)).assignments
				.length;
			const expectedResponse = {
				affectedRows: 1 + affectedAssignments,
				deletedElements: testChallenge,
			} as IDeleteResponse<Challenge>;

			const response = await service.deleteChallengeAndAssignment(testChallenge.id);

			expect(response).toEqual(expectedResponse);
		});

		it('should throw an ActionNotPerformedException if the Assignment with the given ID could not be deleted', async () => {
			const id = '201';

			await expect(() => service.deleteChallengeAndAssignment(id)).rejects.toThrow(
				ConflictException,
			);
		});
	});

	describe('updateChallenge', () => {
		it('should update the challenge with the given ID', async () => {
			const toUpdateElement = testChallenge;
			toUpdateElement.targetedCompletionDate = new Date();
			toUpdateElement.name = 'changedName';

			const response = await service.updateChallenge(toUpdateElement.id, toUpdateElement);

			expect(response).toEqual(toUpdateElement);
		});

		it('should throw an ActionNotPerformedException if the Assignment with the given ID could not be updated', async () => {
			const id = 'wrong-id';

			await expect(() => service.updateChallenge(id, testChallenge)).rejects.toThrow(
				ActionNotPerformedException,
			);
		});
	});
});
