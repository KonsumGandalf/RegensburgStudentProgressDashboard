import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GithubAssignmentService } from '@rspd/challenge-management/backend/challenge-management';
import { GithubAssignment } from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';
import {
	GithubSubmission,
	SubmissionState,
	TestOutcome,
} from '@rspd/student-submissions/backend/common-models';
import { ChallengeSubmissionService } from '@rspd/student-submissions/backend/submission-management';
import { Student } from '@rspd/user/backend/common-models';
import { UserService } from '@rspd/user/backend/user-management';

import { ManuallyCorrectionSubmissionDto } from '../models/dto/correct-test/manually-correction-submission.dto';
import { ManuallyUpdateTestDto } from '../models/dto/correct-test/manually-update-test.dto';
import { TestDto } from '../models/dto/submit/grad-test.dto';
import { ReportDto } from '../models/dto/submit/report.dto';
import { GithubSubmissionService } from './github-submission.service';
import { GithubTestService } from './github-test.service';

describe('GithubTestService', () => {
	let service: GithubSubmissionService;
	let submissions: GithubSubmission[];
	let fakeSubmission: GithubSubmission;
	let githubSubmissionRepository: MockRepository<GithubSubmission>;
	let fakeStudent: Student;
	let fakeAssignment: GithubAssignment;
	let report: ReportDto;
	let correctTestsDto: TestDto[];
	let fakeUserService: UserService;
	let fakeGithubAssignmentService: GithubAssignmentService;
	let fakeGithubTestService: GithubTestService;
	let fakeChallengeSubmissionService: ChallengeSubmissionService;

	beforeEach(async () => {
		fakeStudent = {
			id: faker.datatype.uuid(),
			username: faker.internet.userName(),
		} as Student;
		fakeAssignment = {
			id: faker.datatype.uuid(),
			repositoryUrl: 'git://github.com/OTH-Digital-Skills/lab-04-mario-angie_123',
			minPassedTests: 2,
			totalTests: 3,
		} as GithubAssignment;

		submissions = [];
		for (let i = 0; i < 3; i++) {
			submissions.push({
				id: i.toString(),
				numberOfSubmissions: 1,
				completionState: SubmissionState.Unsolved,
				tests: [
					{
						outcome: TestOutcome.PASSED,
					},
					{
						outcome: TestOutcome.FAILED,
					},
					{
						outcome: TestOutcome.FAILED,
					},
				],
				assignment: fakeAssignment,
			} as GithubSubmission);
		}
		fakeSubmission = submissions[1];

		report = {
			actor: fakeStudent.username,
			repositoryUrl: `${fakeAssignment.repositoryUrl}`,
			repository: fakeAssignment.repositoryUrl,
			submission: {
				summary: {
					total: 2,
					passed: 1,
					failed: 1,
				},
				duration: 0.09,
				tests: [
					{
						outcome: TestOutcome.PASSED,
					},
					{
						outcome: TestOutcome.FAILED,
					},
					{
						outcome: TestOutcome.FAILED,
					},
				],
			},
		};
		correctTestsDto = [
			{
				outcome: TestOutcome.PASSED,
			},
			{
				outcome: TestOutcome.PASSED,
			},
			{
				outcome: TestOutcome.PASSED,
			},
		];

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GithubSubmissionService,
				{
					provide: getRepositoryToken(GithubSubmission),
					useClass: MockRepository,
				},
				{
					provide: UserService,
					useValue: {
						findUserByUsername: jest.fn().mockImplementation(async (arg: any) => {
							return {
								username: faker.internet.userName(),
								id: 'random-id-1',
							} as Student;
						}),
					},
				},
				{
					provide: GithubTestService,
					useValue: {
						createOrUpdateTests: jest.fn().mockImplementation((arg: any) => arg),
						manuallyUpdateTest: jest.fn().mockImplementation((arg: any) => arg),
					},
				},
				{
					provide: ChallengeSubmissionService,
					useValue: {
						createOrUpdateChallengeSubmission: jest
							.fn()
							.mockImplementation((arg: any) => arg),
					},
				},
				{
					provide: GithubAssignmentService,
					useValue: {
						getAssignmentByRepositoryUrl: jest
							.fn()
							.mockImplementation((arg: any) => arg),
					},
				},
			],
		}).compile();
		service = module.get(GithubSubmissionService);
		githubSubmissionRepository = module.get(getRepositoryToken(GithubSubmission));
		githubSubmissionRepository.entities = submissions;

		fakeUserService = module.get(UserService);
		fakeGithubAssignmentService = module.get(GithubAssignmentService);
		fakeGithubTestService = module.get(GithubTestService);
		fakeChallengeSubmissionService = module.get(ChallengeSubmissionService);
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('createOrUpdateSubmissionWithTests', () => {
		it('should handle the control flow correctly to create or update a submission', async () => {
			const formattedUrl = 'https://github.com/username/repo-name';
			report.actor = 'test-user';
			report.repositoryUrl = `${formattedUrl}-${report.actor}`;

			jest.spyOn(fakeUserService, 'findUserByUsername');

			const assignmentSpy = jest.spyOn(
				fakeGithubAssignmentService,
				'getAssignmentByRepositoryUrl',
			);

			const undefinedResult = await service.createOrUpdateSubmissionWithTests(report);

			expect(assignmentSpy).toHaveBeenCalledWith(formattedUrl);
			expect(undefinedResult).toBeUndefined();
		});
	});

	describe('manuallyUpdateSubmission', () => {
		it('should handle the control flow correctly to  update a submission', async () => {
			const manualUpdate = {
				student: fakeStudent.username,
				assigment: fakeAssignment.name,
				tests: correctTestsDto.map((item, idx) => {
					return {
						localId: idx + 1,
						outcome: item.outcome,
					} as ManuallyUpdateTestDto;
				}),
			} as ManuallyCorrectionSubmissionDto;

			const submissionSpy = jest
				.spyOn(service, 'getSubmissionEagerly')
				.mockResolvedValueOnce(fakeSubmission);
			const updateSpy = jest.spyOn(service, 'update');

			const undefinedResult = await service.manuallyUpdateSubmission(manualUpdate);

			expect(submissionSpy).toHaveBeenCalledTimes(1);
			expect(updateSpy).toHaveBeenCalledTimes(1);
			expect(undefinedResult).toBeUndefined();
		});
	});

	describe('createOrUpdateAssignmentSubmission', () => {
		it('should create a new submissionEntity', async () => {
			const createSpy = jest.spyOn(service, 'create');

			const submission = await service.createOrUpdateAssignmentSubmission(
				fakeStudent,
				fakeAssignment,
				report,
			);

			expect(createSpy).toBeCalledTimes(1);
			expect(submission).toMatchObject({
				assignment: fakeAssignment,
				student: fakeStudent,
				duration: 9,
				completionState: SubmissionState.Unsolved,
			} as GithubSubmission);
		});

		it('should update an existing submissionEntity', async () => {
			report.submission.summary = {
				total: 2,
				passed: 2,
				failed: 0,
			};
			report.submission.tests = correctTestsDto;
			jest.spyOn(service, 'findOptions').mockResolvedValueOnce(fakeSubmission);
			const updateSpy = jest.spyOn(service, 'update');
			const submission = await service.createOrUpdateAssignmentSubmission(
				fakeStudent,
				fakeAssignment,
				report,
			);

			expect(updateSpy).toBeCalledTimes(1);
			expect(submission).toMatchObject({
				assignment: fakeAssignment,
				duration: 9,
				// changed attributes
				completionState: SubmissionState.CompletelySolved,
				numberOfSubmissions: 2,
			} as GithubSubmission);
		});
	});

	describe('calculateCompletionState', () => {
		it.each([
			[
				{
					tests: [{ outcome: TestOutcome.PASSED }, { outcome: TestOutcome.PASSED }],
					assignment: {
						minPassedTests: 2,
						totalTests: 2,
					},
				} as GithubSubmission,
				SubmissionState.CompletelySolved,
			],
			[
				{
					tests: [{ outcome: TestOutcome.FAILED }, { outcome: TestOutcome.PASSED }],
					assignment: {
						minPassedTests: 1,
						totalTests: 2,
					},
				} as GithubSubmission,
				SubmissionState.Solved,
			],
			[
				{
					tests: [{ outcome: TestOutcome.FAILED }, { outcome: TestOutcome.FAILED }],
					assignment: {
						minPassedTests: 2,
						totalTests: 2,
					},
				} as GithubSubmission,
				SubmissionState.Unsolved,
			],
		])(
			'should set the correct `completionState`',
			async (submission: GithubSubmission, expectedState: SubmissionState) => {
				const completionState = await service.calculateCompletionState(
					submission.tests,
					submission.assignment.minPassedTests,
					submission.assignment.totalTests,
				);

				expect(completionState).toEqual(expectedState);
			},
		);
	});
});
