import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
	Assignment,
	Challenge,
	GithubAssignment,
	MoodleAssignment,
	Semester,
	UnionAssignment,
} from '@rspd/challenge-management/backend/common-models';
import { SemesterService } from '@rspd/challenge-management/backend/semester-management';
import { MockRepository } from '@rspd/shared/backend/test-util';
import {
	ActionNotPerformedException,
	AssignmentTopic,
	AssignmentType,
	IDeleteResponse,
} from '@rspd/shared/backend/utils';
import { Tutor } from '@rspd/user/backend/common-models';
import { TutorService } from '@rspd/user/backend/user-management';

import { CreateChallengeDto } from '../models/dto/create-challenge.dto';
import { GithubAssignmentDto } from '../models/dto/github-assignment.dto';
import { MoodleAssignmentDto } from '../models/dto/moodle-assignment.dto';
import { AssignmentService } from './assignment.service';
import { ChallengeService } from './challenge.service';
import { GithubAssignmentService } from './github-assignment.service';
import { MoodleAssignmentService } from './moodle-assignment.service';

describe('ChallengeService', () => {
	let service: ChallengeService;
	let challengeRepository: MockRepository;
	let testChallenge: Challenge;
	let challenges: Challenge[];
	let assignmentsRepository: MockRepository;
	let assignments: UnionAssignment[];
	let fakeTutor: Tutor;
	let fakeSemester: Semester;

	beforeEach(async () => {
		fakeTutor = {
			id: '1',
		} as Tutor;

		fakeSemester = {
			name: 'WS-2023',
			start: new Date('2022-09-01'),
			end: new Date('2023-03-01'),
		} as Semester;

		challenges = [];
		assignments = [];
		for (let i = 0; i < 2; i++) {
			const challenge = {
				id: faker.datatype.number({ min: 0, max: 200 }).toString(),
				name: faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
				assignments: [],
				semester: fakeSemester,
			} as Challenge;

			const assignmentTemplate = {
				id: faker.datatype.number({ min: 0, max: 200 }).toString(),
				name: faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
				type: faker.helpers.arrayElement(Object.values(AssignmentType)),
				topics: [faker.helpers.arrayElement(Object.values(AssignmentTopic))],
				repositoryUrl: faker.internet.url(),
				tutorsUrl: new URL(faker.internet.url()),
				challengeId: challenge.id,
			} as UnionAssignment;
			const githubAssignment = {
				...assignmentTemplate,
				minPassedTests: faker.datatype.number({ min: 5, max: 15 }),
				totalTests: faker.datatype.number({ min: 10, max: 20 }),
			} as GithubAssignment;
			challenge.assignments.push(githubAssignment);
			assignments.push(githubAssignment);
			const moodleAssignment = {
				...assignmentTemplate,
				moodleAssignmentId: 1,
				moodleCourseId: 1,
			} as MoodleAssignment;
			challenge.assignments.push(moodleAssignment);
			assignments.push(moodleAssignment);

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
				{
					provide: TutorService,
					useValue: {
						findOneById: jest.fn().mockResolvedValue(fakeTutor),
					},
				},
				{
					provide: SemesterService,
					useValue: {
						findByName: jest.fn().mockResolvedValue(fakeSemester),
					},
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
			const fakeGithubAssignmentDto = {
				...testChallenge.assignments[0],
				displayName: testChallenge.assignments[0].name,
			} as GithubAssignmentDto;

			const fakeMoodleAssignmentDto = {
				...testChallenge.assignments[1],
				displayName: testChallenge.assignments[0].name,
			} as MoodleAssignmentDto;

			const challengeDto: CreateChallengeDto = {
				...testChallenge,
				semesterName: fakeSemester.name,
				assignments: [fakeGithubAssignmentDto, fakeMoodleAssignmentDto],
			};
			const createdChallenge = await service.createChallengeAndAssignments(
				challengeDto,
				fakeTutor.username,
			);

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

	describe('getChallengeEagerly', () => {
		it(
			'should return the challenge of the given id with the Relations to ' +
				'`AssignmentSubmission`, `Tutor` and `Submission`',
			async () => {
				const fakeChallenge = {
					...challenges[0],
					assignments: [
						{
							id: 'random-id',
						},
					],
					tutor: {
						id: 'random-id-2',
					},
				} as Challenge;
				const functionSpy = jest
					.spyOn(service, 'findOptions')
					.mockResolvedValueOnce(fakeChallenge);

				const receivedChallenge = await service.getChallengeEagerly(fakeChallenge.id);

				expect(functionSpy).toHaveBeenCalledTimes(1);
				expect(receivedChallenge).toEqual(receivedChallenge);
			},
		);
	});
});
