import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssignmentService } from '@rspd/challenge-management/backend/challenge-management';
import { ChallengeService } from '@rspd/challenge-management/backend/challenge-management';
import { Challenge } from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { addIfNotContained } from '@rspd/shared/backend/utils';
import {
	AssignmentSubmission,
	ChallengeSubmission,
	SubmissionState,
} from '@rspd/student-submissions/backend/common-models';

import { ChallengeSubmissionService } from './challenge-submission.service';

describe('ChallengeService', () => {
	let service: ChallengeSubmissionService;
	let challengeSubmissionRepository: MockRepository<ChallengeSubmission>;
	let submissions: ChallengeSubmission[];
	let fakeSubmission: ChallengeSubmission;
	let fakeAssignmentSubmission: AssignmentSubmission;
	let assignmentSubmissions: AssignmentSubmission[];
	let fakeChallenge: Challenge;
	let fakeUsername: string;

	beforeEach(async () => {
		submissions = [];
		fakeChallenge = {
			id: 'random-challenge-id-1',
			assignments: [
				{
					id: `random-assignment-id-1`,
				},
				{
					id: `random-assignment-id-2`,
				},
				{
					id: `random-assignment-id-3`,
				},
			],
		} as Challenge;
		fakeUsername = faker.internet.userName();
		for (let i = 0; i < 5; i++) {
			const localChallenge = {
				id: `random-challenge-id-${i}`,
				assignments: [
					{
						id: `random-assignment-id-${i}`,
						submissions: [
							{
								id: `random-assignment-id-${i}`,
							} as AssignmentSubmission,
						],
					},
				],
			} as Challenge;
			assignmentSubmissions = [];
			for (let x = 0; x < 3; x++) {
				assignmentSubmissions.push({
					id: `random-challenge-submission-id-${x}-${i}`,
					completionState: SubmissionState.Unsolved,
					assignment: {
						id: `random-assignment-id-${i}`,
						challenge: localChallenge,
						submissions: [],
					},
					student: {
						username: fakeUsername,
					},
				} as AssignmentSubmission);
			}

			submissions.push({
				id: i.toString(),
				challenge: localChallenge,
				student: {
					username: fakeUsername,
				},
				submissions: assignmentSubmissions,
				completionState: SubmissionState.Unsolved,
			} as ChallengeSubmission);
			fakeChallenge.submissions = submissions;
		}
		submissions[0].completionState = SubmissionState.CompletelySolved;
		fakeSubmission = submissions[1];
		fakeAssignmentSubmission = fakeSubmission.submissions[1];

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ChallengeSubmissionService,
				{
					provide: AssignmentService,
					useValue: {
						getChallengeByAssignmentId: jest
							.fn()
							.mockImplementation(async (id: string) => fakeChallenge),
						findOptionsMany: jest
							.fn()
							.mockResolvedValueOnce(fakeSubmission.submissions),
					},
				},
				{
					provide: ChallengeService,
					useValue: {
						getChallengeEagerly: jest
							.fn()
							.mockImplementation(async (id: string) => fakeChallenge),
					},
				},
				{
					provide: getRepositoryToken(ChallengeSubmission),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(ChallengeSubmissionService);
		challengeSubmissionRepository = module.get(getRepositoryToken(ChallengeSubmission));
		challengeSubmissionRepository.entities = submissions;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('getChallengeSubmissionByUserAssignmentId', () => {
		it('should return a challengeSubmission for the given challengeId', async () => {
			const submission = await service.getChallengeSubmissionByUserAssignmentId(
				fakeChallenge.id,
				fakeUsername,
			);
			expect(submission).toEqual(fakeSubmission);
		});
	});

	describe('getUserSolvedElements', () => {
		it('should return all 2 solved `AssignmentSubmissions` of a user', async () => {
			jest.spyOn(challengeSubmissionRepository, 'find').mockResolvedValueOnce(
				challengeSubmissionRepository.entities.filter(
					(ele) =>
						ele.student.username == fakeUsername &&
						(ele.completionState == SubmissionState.Solved ||
							ele.completionState == SubmissionState.CompletelySolved),
				),
			);

			const results = await service.getUserSolvedElements(fakeUsername);

			expect(results.length).toBe(1);
		});
	});

	describe('createOrUpdateChallengeSubmission', () => {
		it('should create a new challengeSubmission', async () => {
			jest.spyOn(service, 'getChallengeSubmissionByUserAssignmentId').mockResolvedValueOnce(
				undefined,
			);
			const createSpy = jest.spyOn(service, 'create');
			await service.createOrUpdateChallengeSubmission(fakeAssignmentSubmission);

			expect(createSpy).toHaveBeenCalledTimes(1);
		});

		it('should update an existing challengeSubmission', async () => {
			const updateSpy = jest.spyOn(service, 'updateChallengeStateAndConnection');
			await service.createOrUpdateChallengeSubmission(fakeAssignmentSubmission);

			expect(updateSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('updateChallengeStateAndConnection', () => {
		it.each([
			[
				[
					{
						id: 'test',
						completionState: SubmissionState.Unsolved,
					},
					{
						id: 'test-2',
						completionState: SubmissionState.Unsolved,
					},
				],
				{
					id: 'test',
					completionState: SubmissionState.Solved,
				} as AssignmentSubmission,
				SubmissionState.Unsolved,
			],
			[
				[
					{
						id: 'test',
						completionState: SubmissionState.Solved,
					},
					{
						id: 'test-2',
						completionState: SubmissionState.Solved,
					},
				],
				{
					id: 'test',
					completionState: SubmissionState.Unsolved,
				} as AssignmentSubmission,
				SubmissionState.Unsolved,
			],
			[
				[
					{
						id: 'test',
						completionState: SubmissionState.Solved,
					},
					{
						id: 'test-2',
						completionState: SubmissionState.Solved,
					},
				],
				{
					id: 'test-3',
					completionState: SubmissionState.Solved,
				} as AssignmentSubmission,
				SubmissionState.Solved,
			],
		])(
			'should update the connected Assignments and the challenge state correctly',
			async (
				oldSubmissions: AssignmentSubmission[],
				newSubmission: AssignmentSubmission,
				expectedState: SubmissionState,
			) => {
				const dbSubmission = {
					...fakeSubmission,
					submissions: oldSubmissions,
				} as ChallengeSubmission;
				const result = await service.updateChallengeStateAndConnection(
					dbSubmission,
					newSubmission,
				);

				expect(result).toMatchObject({
					...fakeSubmission,
					completionState: expectedState,
					submissions: addIfNotContained(oldSubmissions, newSubmission),
				});
			},
		);
	});

	describe('getUserChallengeSubmissions', () => {
		it('should set the assignment for each assignmentSubmission correctly', async () => {
			jest.spyOn(service, 'findOptionsMany').mockResolvedValueOnce([]);

			const results = await service.getUserChallengeSubmissions(
				submissions[0].student.username,
			);

			const assignments = [];
			for (const result of results) {
				for (const assignmentSubmission of result.submissions) {
					assignments.push(assignmentSubmission.assignment);
					expect(assignmentSubmission.assignment).toBeDefined();
					expect(assignments).toContain(assignmentSubmission.assignment);
				}
			}
		});
	});
});
