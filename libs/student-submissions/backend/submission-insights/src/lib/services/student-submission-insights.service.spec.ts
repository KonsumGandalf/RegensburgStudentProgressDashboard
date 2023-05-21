import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import {
	AssignmentService,
	ChallengeService,
} from '@rspd/challenge-management/backend/challenge-management';
import {
	Assignment,
	Challenge,
	GithubAssignment,
	MoodleAssignment,
	Semester,
} from '@rspd/challenge-management/backend/common-models';
import { AssignmentTopic, AssignmentType } from '@rspd/shared/backend/utils';
import {
	AssignmentSubmission,
	ChallengeSubmission,
	GithubSubmission,
	GithubTest,
	MoodleSubmission,
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
import { StudentService, UserService } from '@rspd/user/backend/user-management';

import { StudentSubmissionInsightsService } from './student-submission-insights.service';

describe('StudentSubmissionInsightsService', () => {
	let service: StudentSubmissionInsightsService;
	let studentService: StudentService;
	let assignmentSubmissionService: AssignmentSubmissionService;
	let challengesService: ChallengeService;
	let challengeSubmissionService: ChallengeSubmissionService;
	let assignmentService: AssignmentService;
	let githubTestService: GithubTestService;
	let fakeTests: GithubTest[];
	let fakeAssignmentSubmissions: AssignmentSubmission[];
	let fakeChallengeSubmission: ChallengeSubmission;
	let fakeStudents: Student[];
	let fakeSemester: Semester[];
	let fakeChallenges: Challenge[];

	beforeEach(async () => {
		fakeSemester = [
			{
				name: 'WS-2023',
				start: new Date('2022-09-01'),
				end: new Date('2023-03-01'),
			} as Semester,
			{
				name: 'WS-2024',
				start: new Date('2023-09-01'),
				end: new Date('2024-03-01'),
			} as Semester,
		];

		fakeChallenges = [
			{
				id: 'random-challenge',
				name: faker.name.fullName(),
				targetedCompletionDate: faker.date.future(),
				semester: fakeSemester[0],
			} as Challenge,
			{
				id: 'random-challenge',
				name: faker.name.fullName(),
				targetedCompletionDate: faker.date.future(),
				semester: fakeSemester[1],
			} as Challenge,
		];

		const assignmentTemplate = {
				id: '1',
				name: 'Assignment 1',
				challenge: fakeChallenges[0],
				displayName: 'Assignment 1 Display Name',
				topics: [AssignmentTopic.PYTHON, AssignmentTopic.IOT],
				tutorsUrl: new URL('git://github.com/OTH-Digital-Skills'),
				repositoryUrl: 'git://github.com/OTH-Digital-Skills',
			} as Assignment,
			fakeAssignments = [
				{
					...assignmentTemplate,
					type: AssignmentType.GITHUB,
					minPassedTests: 2,
					topics: [AssignmentTopic.PYTHON],
					totalTests: 1,
				} as GithubAssignment,
				{
					...assignmentTemplate,
					id: '2',
					name: 'Assignment 2',
					type: AssignmentType.MOODLE,
					moodleAssignmentId: 1,
					topics: [AssignmentTopic.ROBOTIC],
					moodleCourseId: 1,
				} as MoodleAssignment,
			];

		fakeChallenges[0].assignments = fakeAssignments;

		fakeStudents = [
			{
				id: 'random-user',
				username: faker.internet.userName(),
				semester: fakeSemester[0],
			} as Student,
			{
				id: 'random-user-2',
				username: faker.internet.userName(),
				semester: fakeSemester[0],
			} as Student,
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
			challenge: fakeChallenges[0],
			student: fakeStudents[0] as Student,
			completionState: SubmissionState.Unsolved,
		} as ChallengeSubmission;

		fakeAssignmentSubmissions = [];
		fakeAssignmentSubmissions.push({
			id: '0',
			tests: fakeTests,
			assignment: fakeAssignments[0],
			completionState: SubmissionState.Unsolved,
			challengeSubmission: fakeChallengeSubmission,
		} as GithubSubmission);
		fakeAssignmentSubmissions.push({
			id: '1',
			assignment: fakeAssignments[1],
			completionState: SubmissionState.Solved,
			challengeSubmission: fakeChallengeSubmission,
		} as MoodleSubmission);
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
						getAllSolvedSubmissions: jest.fn().mockImplementation((name) =>
							fakeAssignmentSubmissions.filter((submission) => {
								if (
									submission.assignment.name == name &&
									submission.completionState != SubmissionState.Unsolved
								) {
									return submission;
								}
							}),
						),
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
							.mockImplementation(async (username: string) =>
								fakeTests.filter((test) => test.outcome == TestOutcome.PASSED),
							),
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
						getChallengesOfSemester: jest
							.fn()
							.mockImplementation(async (semesterName) =>
								fakeChallenges.filter(
									(challenge) => challenge.semester.name == semesterName,
								),
							),
						findOptionsMany: jest.fn().mockResolvedValue(fakeChallenges),
						getChallengeByAssignmentId: jest
							.fn()
							.mockImplementation(async () => fakeChallenges[0]),
					},
				},
				{
					provide: AssignmentService,
					useValue: {
						findAllAssignments: jest
							.fn()
							.mockImplementation(async () => fakeAssignments),
						getAssignmentByName: jest
							.fn()
							.mockImplementation(async (name: string) =>
								fakeAssignments.find((assignment) => assignment.name == name),
							),
					},
				},
				{
					provide: StudentService,
					useValue: {
						getStudentEagerly: jest
							.fn()
							.mockImplementation(async (username) =>
								fakeStudents.find((user) => user.username == username),
							),
						findAll: jest.fn().mockResolvedValueOnce(fakeStudents),
					},
				},
			],
		}).compile();

		service = module.get(StudentSubmissionInsightsService);
		assignmentSubmissionService = module.get(AssignmentSubmissionService);
		challengesService = module.get(ChallengeService);
		studentService = module.get(StudentService);
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
				fakeStudents[0].username,
			);
			expect(absoluteProgressOverview).toEqual({
				assignment: { all: 2, solved: 2 },
				challenge: { all: 1, solved: 1 },
				test: { all: 2, solved: 1 },
			});
		});
	});

	describe('getChallengeOverview', () => {
		it('should return an empty array in case no challenge is found', async () => {
			jest.spyOn(challengesService, 'getChallengesOfSemester').mockResolvedValueOnce([]);

			const response = await service.getChallengeOverview(fakeStudents[0].username);

			expect(response).toMatchObject({
				challenges: [],
			});
		});

		it('should return overview information and delegate the requests to the different services correctly', async () => {
			const response = await service.getChallengeOverview(fakeStudents[0].username);

			expect(challengesService.getChallengesOfSemester).toHaveBeenCalledTimes(1);
			expect(challengeSubmissionService.getUserChallengeSubmissions).toHaveBeenCalledTimes(1);
			expect(response).toMatchObject({
				challenges: [
					{
						name: fakeChallenges[0].name,
						targetedCompletionDate: fakeChallenges[0].targetedCompletionDate,
						completionState: SubmissionState.Unsolved,
						challengeScore: {
							all: 2,
							solved: 1,
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
				submission.assignment,
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
			const assignment = fakeAssignmentSubmissions[1].assignment;

			const result = await service.getAssignmentRelatedInformation(
				assignment,
				fakeChallengeSubmission,
				fakeStudents[0].username,
			);

			expect(githubTestService.getNumberOfSolvedTests).toHaveBeenCalledTimes(0);
			expect(result).toMatchObject({
				assignmentScore: {
					all: 1,
					solved: 1,
				},
				completionState: SubmissionState.Solved,
				displayName: assignment.displayName,
				id: '2',
				name: assignment.name,
				topics: assignment.topics,
			} as IAssignmentOverview);
		});
	});

	describe('getTopicProgress', () => {
		it('should return the solution percentage for all AssignmentTopics correctly', async () => {
			const assignments = fakeChallenges[0].assignments;
			assignments.push({
				id: '3',
				topics: [AssignmentTopic.ROBOTIC],
			} as Assignment);
			jest.spyOn(assignmentService, 'findAllAssignments').mockResolvedValue(assignments);

			const result = await service.getTopicProgress(fakeStudents[0].username);
			expect(result).toMatchObject(
				new Map([
					['FLASK', 0],
					['IOT', 0],
					['PYTHON', 1],
					['ROBOTIC', 0.5],
					['SQL', 0],
					['SCRATCH', 0],
					['WEB', 0],
				]),
			);
		});
	});

	describe('getAssignmentSubmissionDetails', () => {
		let user: User;
		let assignment: Assignment;
		let expectedResult;
		beforeEach(() => {
			user = fakeStudents[0];
		});

		it('should return all information of a moodle assignment', async () => {
			assignment = fakeAssignmentSubmissions[1].assignment;
			expectedResult = {
				allStudents: {
					all: 2,
					solved: 1,
				},
				assignmentType: AssignmentType.MOODLE,
				displayName: 'Assignment 1 Display Name',
				id: '2',
				name: 'Assignment 2',
				repositoryUrl: new URL('git://github.com/OTH-Digital-Skills'),
				topics: ['ROBOTIC'],
				tutorsUrl: new URL('git://github.com/OTH-Digital-Skills'),
			} as IAssignmentDetail;

			const response = await service.getAssignmentSubmissionDetails(
				user.username,
				assignment.name,
			);

			expect(studentService.findAll).toHaveBeenCalledTimes(1);
			expect(assignmentSubmissionService.getAllSolvedSubmissions).toHaveBeenCalledTimes(1);
			expect(assignmentSubmissionService.getSubmissionOfUser).toHaveBeenCalledTimes(1);
			expect(challengesService.getChallengeByAssignmentId).toHaveBeenCalledTimes(1);
			expect(response).toMatchObject(expectedResult);
			expect(response.tests).toBeUndefined();
		});

		it('should return all information of a github assignment', async () => {
			assignment = fakeAssignmentSubmissions[0].assignment;
			expectedResult = {
				allStudents: {
					all: 2,
					solved: 0,
				},
				assignmentType: AssignmentType.GITHUB,
				displayName: 'Assignment 1 Display Name',
				id: '1',
				name: 'Assignment 1',
				repositoryUrl: new URL('git://github.com/OTH-Digital-Skills'),
				topics: ['PYTHON'],
				tutorsUrl: new URL('git://github.com/OTH-Digital-Skills'),
			} as IAssignmentDetail;

			const response = await service.getAssignmentSubmissionDetails(
				user.username,
				assignment.name,
			);

			expect(studentService.findAll).toHaveBeenCalledTimes(1);
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
