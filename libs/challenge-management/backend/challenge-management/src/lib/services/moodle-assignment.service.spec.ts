import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Challenge, MoodleAssignment } from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { AssignmentTopic, AssignmentType } from '@rspd/shared/backend/utils';

import { MoodleAssignmentDto } from '../models/dto/moodle-assignment.dto';
import { MoodleAssignmentService } from './moodle-assignment.service';

describe('MoodleAssignmentService', () => {
	let service: MoodleAssignmentService;
	let assignmentRepository: MockRepository<MoodleAssignment>;
	const assignments: MoodleAssignment[] = [];

	beforeEach(async () => {
		for (let i = 0; i < 2; i++) {
			const testAssignment = {
				id: faker.datatype.number({ min: 0, max: 200 }).toString(),
				name: faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
				type: faker.helpers.arrayElement(Object.values(AssignmentType)),
				topics: [faker.helpers.arrayElement(Object.values(AssignmentTopic))],
				repositoryUrl: faker.internet.url(),
				tutorsUrl: new URL(faker.internet.url()),
				moodleCourseId: 1,
			} as MoodleAssignment;
			assignments.push(testAssignment);
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MoodleAssignmentService,
				{
					provide: getRepositoryToken(MoodleAssignment),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(MoodleAssignmentService);
		assignmentRepository = module.get(getRepositoryToken(MoodleAssignment));
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
				displayName: 'mario-1',
				type: faker.helpers.arrayElement(Object.values(AssignmentType)),
				topics: [faker.helpers.arrayElement(Object.values(AssignmentTopic))],
				repositoryUrl: faker.internet.url(),
				tutorsUrl: new URL(faker.internet.url()),
				moodleAssignmentId: 1,
			} as MoodleAssignmentDto;

			const createdAssignment = await service.createAssignment(challenge, 1, assignmentDto);

			expect(createdAssignment).toMatchObject({
				...assignmentDto,
				displayName: assignmentDto.displayName,
				name: 'mario-1',
			});
		});
	});

	describe('updateAssignment', () => {
		let toUpdateElement: MoodleAssignment;
		let updateDto: MoodleAssignmentDto;

		beforeEach(() => {
			toUpdateElement = assignments[0];
			updateDto = {
				...toUpdateElement,
				displayName: 'Changed Name',
				moodleAssignmentId: 1,
			} as MoodleAssignmentDto;
			toUpdateElement.moodleAssignmentId = 1;
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
