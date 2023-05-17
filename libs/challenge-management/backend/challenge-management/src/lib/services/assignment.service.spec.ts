import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment, Challenge } from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';
import {
	AssignmentTopic,
	AssignmentType,
	IDeleteResponse,
	NoContentException,
} from '@rspd/shared/backend/utils';

import { AssignmentDto } from '../models/dto/assignment.dto';
import { AssignmentService } from './assignment.service';

describe('AssignmentService', () => {
	let service: AssignmentService;
	let assignmentRepository: MockRepository<Assignment>;
	const assignments: Assignment[] = [];

	beforeEach(async () => {
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
			} as unknown as Assignment;
			assignments.push(testAssignment);
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssignmentService,
				{
					provide: getRepositoryToken(Assignment),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get<AssignmentService>(AssignmentService);
		assignmentRepository = module.get<MockRepository<Assignment>>(
			getRepositoryToken(Assignment),
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
			const assignmentDto: AssignmentDto = {
				displayName: 'Mario 1',
				type: faker.helpers.arrayElement(Object.values(AssignmentType)),
				topics: [faker.helpers.arrayElement(Object.values(AssignmentTopic))],
				repositoryUrl: new URL(faker.internet.url()).toString(),
				tutorsUrl: new URL(faker.internet.url()),
				minPassedTests: faker.datatype.number({ min: 5, max: 15 }),
				totalTests: faker.datatype.number({ min: 10, max: 20 }),
			} as AssignmentDto;

			const createdAssignment = await service.createAssignment(challenge, assignmentDto);

			expect(createdAssignment).toMatchObject({
				...assignmentDto,
				displayName: assignmentDto.displayName,
				name: 'mario-1',
			});
		});
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

	describe('getAssignmentByRepositoryUrl', () => {
		it('should return the Assignment by the given repositoryUrl', async () => {
			const assignment = await service.getAssignmentByRepositoryUrl(
				assignments[0].repositoryUrl,
			);

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

		it('should throw an error if the Assignment with the given ID is not found', async () => {
			const id = '201';

			await expect(() => service.getAssignmentByChallengeId(id)).rejects.toThrow(
				NoContentException,
			);
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

	describe('updateAssignment', () => {
		let toUpdateElement: Assignment;
		let updateDto: AssignmentDto;

		beforeEach(() => {
			toUpdateElement = assignments[0];
			updateDto = {
				...toUpdateElement,
				displayName: 'Changed Name',
				totalTests: 12,
			} as AssignmentDto;
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

	describe('getDisplayAndUniqueName', () => {
		it('should transform the name property correctly', async () => {
			const testName = ' Test 923 ';

			const result = service.getDisplayAndUniqueName(testName);

			expect(result).toEqual({
				name: 'test-923',
				displayName: 'Test 923',
			});
		});
	});
});
