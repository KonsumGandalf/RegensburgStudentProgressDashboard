import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import {
	AssignmentService,
	ChallengeService,
} from '@rspd/challenge-management/backend/challenge-management';
import { Assignment, Challenge } from '@rspd/challenge-management/backend/common-models';
import { AssignmentTopic, AssignmentType } from '@rspd/shared/backend/utils';
import {
	AssignmentSubmission,
	ChallengeSubmission,
	GithubSubmission,
	GithubTest,
	SubmissionState,
	TestOutcome,
} from '@rspd/student-submissions/backend/common-models';
import {
	GithubSubmissionService,
	GithubTestService,
} from '@rspd/student-submissions/backend/github-submissions';
import {
	AssignmentSubmissionService,
	ChallengeSubmissionService,
} from '@rspd/student-submissions/backend/submission-management';
import {
	IAssignmentDetail,
	IAssignmentOverview,
	IChallengeSubmissionOverview,
} from '@rspd/student-submissions/common/models';
import { Student, User } from '@rspd/user/backend/common-models';
import { UserService } from '@rspd/user/backend/user-management';

import { StudentSubmissionInsightsService } from './student-submission-insights.service';

describe('StudentSubmissionInsightsService', () => {
	let service: StudentSubmissionInsightsService;
	let userService: UserService;
	let assignmentSubmissionService: AssignmentSubmissionService;
	let challengesService: ChallengeService;
	let challengeSubmissionService: ChallengeSubmissionService;
	let assignmentService: ChallengeSubmissionService;
	let githubTestService: GithubTestService;
	let fakeTests: GithubTest[];
	let fakeAssignmentSubmissions: AssignmentSubmission[];
	let fakeChallengeSubmission: ChallengeSubmission;
	let fakeAssignments: Assignment[];
	let fakeUser: User[];
	let fakeChallenge: Challenge;

	beforeEach(async () => {
		fakeChallenge = {
			id: 'random-challenge',
			name: faker.name.fullName(),
			targetedCompletionDate: faker.date.future(),
		} as Challenge;

		fakeAssignments = [
			{
				id: '1',
				name: 'Assignment 1',
				challenge: fakeChallenge,
				displayName: 'Assignment 1 Display Name',
				topics: [AssignmentTopic.PYTHON, AssignmentTopic.IOT],
				type: AssignmentType.GITHUB,
				tutorsUrl: new URL('git://github.com/OTH-Digital-Skills'),
				repositoryUrl: 'git://github.com/OTH-Digital-Skills',
				totalTests: 1,
			} as Assignment,
		];
		fakeChallenge.assignments = fakeAssignments;

		fakeUser = [
			{
				id: 'random-user',
				username: faker.internet.userName(),
			} as User,
		];

		fakeTests = [];
		for (let a = 0; a < 3; a++) {
			fakeTests.push({
				id: a.toString(),
				outcome: TestOutcome.FAILED,
				errorMsg: 'test',
			} as GithubTest);
		}
		fakeTests[0].outcome = TestOutcome.PASSED;

		fakeChallengeSubmission = {
			id: 'random-challenge-submission',
			challenge: fakeChallenge,
			student: fakeUser[0] as Student,
			completionState: SubmissionState.Unsolved,
		} as ChallengeSubmission;

		fakeAssignmentSubmissions = [];
		for (let a = 0; a < 3; a++) {
			fakeAssignmentSubmissions.push({
				id: a.toString(),
				tests: fakeTests,
				assignment: fakeAssignments[0],
				completionState: SubmissionState.Unsolved,
				challengeSubmission: fakeChallengeSubmission,
			} as GithubSubmission);
		}
		fakeChallengeSubmission.submissions = fakeAssignmentSubmissions;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StudentSubmissionInsightsService,
				{
					provide: AssignmentSubmissionService,
					useValue: {
						getUserSolvedElements: jest
							.fn()
							.mockResolvedValue(fakeAssignmentSubmissions),
						getAllSolvedSubmissions: jest
							.fn()
							.mockResolvedValue(fakeAssignmentSubmissions),
						getSubmissionOfUser: jest
							.fn()
							.mockResolvedValue(fakeAssignmentSubmissions[0]),
					},
				},
				{
					provide: ChallengeSubmissionService,
					useValue: {
						getUserSolvedElements: jest
							.fn()
							.mockImplementation(async (username: string) => [
								fakeChallengeSubmission,
							]),
						getUserChallengeSubmissions: jest
							.fn()
							.mockImplementation(async (username: string) =>
								[fakeChallengeSubmission].filter(
									(submission) => submission.student.username == username,
								),
							),
					},
				},
				{
					provide: GithubSubmissionService,
					useValue: {
						getTestsOfSubmission: jest
							.fn()
							.mockImplementation(async (id: string) => fakeTests),
					},
				},
				{
					provide: GithubTestService,
					useValue: {
						getSolvedUserTests: jest
							.fn()
							.mockImplementation(async (username: string) => fakeTests),
						getNumberOfSolvedTests: jest
							.fn()
							.mockResolvedValue(
								fakeTests.filter((test) => test.outcome === TestOutcome.PASSED)
									.length,
							),
					},
				},
				{
					provide: ChallengeService,
					useValue: {
						findAll: jest.fn().mockImplementation(async () => []),
						findOptionsMany: jest.fn().mockResolvedValue([fakeChallenge]),
						getChallengeByAssignmentId: jest
							.fn()
							.mockImplementation(async () => fakeChallenge),
					},
				},
				{
					provide: AssignmentService,
					useValue: {
						findAll: jest.fn().mockImplementation(async () => []),
					},
				},
				{
					provide: UserService,
					useValue: {
						find: jest.fn().mockImplementation(async () => []),
						findAllStudents: jest.fn().mockResolvedValueOnce([fakeUser]),
					},
				},
			],
		}).compile();

		service = module.get(StudentSubmissionInsightsService);
		assignmentSubmissionService = module.get(AssignmentSubmissionService);
		challengesService = module.get(ChallengeService);
		userService = module.get(UserService);
		githubTestService = module.get(GithubTestService);
		challengeSubmissionService = module.get(ChallengeSubmissionService);
		assignmentService = module.get(AssignmentService);
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('getAbsoluteProgressOverview', () => {
		it('should delegate the requests to the different services correctly', async () => {
			const absoluteProgressOverview = await service.getAbsoluteProgressOverview(
				'testUsername',
			);
			expect(absoluteProgressOverview).toBeDefined();
		});
	});

	describe('getChallengeOverview', () => {
		it('should return an empty array in case no challenge is found', async () => {
			jest.spyOn(challengesService, 'findOptionsMany').mockResolvedValueOnce([]);

			const response = await service.getChallengeOverview('test-user');

			expect(response).toMatchObject({
				challenges: [],
			});
		});

		it('should return overview information and delegate the requests to the different services correctly', async () => {
			const response = await service.getChallengeOverview(fakeUser[0].username);

			expect(challengesService.findOptionsMany).toHaveBeenCalledTimes(1);
			expect(challengeSubmissionService.getUserChallengeSubmissions).toHaveBeenCalledTimes(1);
			expect(response).toMatchObject({
				challenges: [
					{
						name: fakeChallenge.name,
						targetedCompletionDate: fakeChallenge.targetedCompletionDate,
						completionState: SubmissionState.Unsolved,
						challengeScore: {
							all: 1,
							solved: 0,
						},
					} as IChallengeSubmissionOverview,
				],
			});
		});
	});

	describe('addGithubInformation', () => {
		it('should add the githubTest related Information to the assignmentInformation', async () => {
			const submission = fakeAssignmentSubmissions[1];
			const response = await service.addGithubInformation(
				{} as IAssignmentDetail,
				submission,
			);

			expect(response).toMatchObject({
				assignmentScore: {
					all: 1,
					solved: 1,
				},
				tests: fakeTests,
			});
		});
	});

	describe('getAssignmentRelatedInformation', () => {
		it('should return the assignment related information', async () => {
			const assignment = fakeAssignments[0];

			const result = await service.getAssignmentRelatedInformation(
				assignment,
				fakeChallengeSubmission,
			);

			expect(githubTestService.getNumberOfSolvedTests).toHaveBeenCalledTimes(1);
			expect(result).toMatchObject({
				assignmentScore: {
					all: 1,
					solved: 1,
				},
				completionState: SubmissionState.Unsolved,
				displayName: assignment.displayName,
				id: '1',
				name: assignment.name,
				topics: assignment.topics,
			} as IAssignmentOverview);
		});
	});

	describe('getAssignmentSubmissionDetails', () => {
		let user: User;
		let assignment: Assignment;
		let expectedResult;
		beforeEach(() => {
			user = fakeUser[0];
			assignment = fakeAssignments[0];
			expectedResult = {
				allStudents: {
					all: 1,
					solved: 3,
				},
				assignmentType: 'MOODLE',
				displayName: 'Assignment 1 Display Name',
				id: '1',
				name: 'Assignment 1',
				submissionPlatformUrl: new URL('git://github.com/OTH-Digital-Skills'),
				topics: ['PYTHON', 'IOT'],
				tutorsUrl: new URL('git://github.com/OTH-Digital-Skills'),
			} as IAssignmentDetail;
		});

		it('should return all information of a moodle assignment', async () => {
			fakeAssignments[0].type = AssignmentType.MOODLE;

			const response = await service.getAssignmentSubmissionDetails(
				user.username,
				assignment.name,
			);

			expect(userService.findAllStudents).toHaveBeenCalledTimes(1);
			expect(assignmentSubmissionService.getAllSolvedSubmissions).toHaveBeenCalledTimes(1);
			expect(assignmentSubmissionService.getSubmissionOfUser).toHaveBeenCalledTimes(1);
			expect(challengesService.getChallengeByAssignmentId).toHaveBeenCalledTimes(1);
			expect(response).toMatchObject(expectedResult);
			expect(response.assignmentScore).toBeUndefined();
			expect(response.tests).toBeUndefined();
		});

		it('should return all information of a github assignment', async () => {
			fakeAssignments[0].type = AssignmentType.GITHUB;
			expectedResult.assignmentType = AssignmentType.GITHUB;

			const response = await service.getAssignmentSubmissionDetails(
				user.username,
				assignment.name,
			);

			expect(userService.findAllStudents).toHaveBeenCalledTimes(1);
			expect(assignmentSubmissionService.getAllSolvedSubmissions).toHaveBeenCalledTimes(1);
			expect(assignmentSubmissionService.getSubmissionOfUser).toHaveBeenCalledTimes(1);
			expect(challengesService.getChallengeByAssignmentId).toHaveBeenCalledTimes(1);
			expect(response).toMatchObject({
				...expectedResult,
				assignmentScore: {
					all: 1,
					solved: 1,
				},
				tests: fakeTests,
			});
		});
	});
});
