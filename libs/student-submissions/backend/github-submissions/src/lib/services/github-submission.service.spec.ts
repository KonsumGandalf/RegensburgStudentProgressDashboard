import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssignmentService } from '@rspd/challenge-management/backend/challenge-management';
import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { Submission } from '@rspd/student-submissions/backend/common-models';
import { Student } from '@rspd/user/backend/common-models';
import { StudentService, UserService } from '@rspd/user/backend/user-management';

import { ReportDto } from '../models/dto/report.dto';
import { GithubSubmission } from '../models/entities/github-submission.entity';
import { TestOutcome } from '../models/enums/test-outcome.enum';
import { GithubSubmissionService } from './github-submission.service';
import { GithubTestService } from './github-test.service';

describe('GithubTestService', () => {
	let service: GithubSubmissionService;
	let testService: GithubTestService;
	let submissions: GithubSubmission[];
	let fakeSubmission: GithubSubmission;
	let githubSubmissionRepository: MockRepository<GithubSubmission>;
	let fakeStudent: Student;
	let fakeAssignment: Assignment;
	let report: ReportDto;

	beforeEach(async () => {
		fakeStudent = {
			id: faker.datatype.uuid(),
			username: faker.internet.userName(),
		} as Student;
		fakeAssignment = {
			id: faker.datatype.uuid(),
			repositoryUrl: 'git://github.com/OTH-Digital-Skills/lab-04-mario-angie_123',
		} as Assignment;

		submissions = [];
		for (let i = 0; i < 3; i++) {
			submissions.push({
				id: i.toString(),
				numberOfSubmissions: 1,
				completionPercentage: faker.datatype.number(),
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
				],
			},
		};

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
						findUserByUsername: jest.fn().mockImplementation((arg: any) => arg),
					},
				},
				{
					provide: GithubTestService,
					useValue: {
						createOrUpdateTests: jest.fn().mockImplementation((arg: any) => arg),
					},
				},
				{
					provide: AssignmentService,
					useValue: {
						getAssignmentByRepositoryUrl: jest
							.fn()
							.mockImplementation((arg: any) => arg),
					},
				},
			],
		}).compile();
		service = module.get(GithubSubmissionService);
		testService = module.get(GithubTestService);
		githubSubmissionRepository = module.get(getRepositoryToken(GithubSubmission));
		githubSubmissionRepository.entities = submissions;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('createOrUpdateSubmission', () => {
		it('should create a new submissionEntity', async () => {
			const submission = await service.createOrUpdateSubmission(
				fakeStudent,
				fakeAssignment,
				report,
			);

			expect(submission).toMatchObject({
				assignment: fakeAssignment,
				student: fakeStudent,
				duration: 9,
				numberOfSubmissions: 1,
			} as GithubSubmission);
			expect(+submission.completionPercentage).toBeCloseTo(0.5);
		});

		it('should update an existing submissionEntity', async () => {
			report.submission.summary = {
				total: 2,
				passed: 2,
				failed: 0,
			};
			report.submission.tests = [
				{
					outcome: TestOutcome.PASSED,
				},
				{
					outcome: TestOutcome.PASSED,
				},
			];

			await service.createOrUpdateSubmission(fakeStudent, fakeAssignment, report);
			const submission = await service.createOrUpdateSubmission(
				fakeStudent,
				fakeAssignment,
				report,
			);

			expect(submission).toMatchObject({
				assignment: fakeAssignment,
				student: fakeStudent,
				duration: 9,
				// changed attributes
				numberOfSubmissions: 2,
			} as GithubSubmission);
			expect(+submission.completionPercentage).toBeCloseTo(1);
		});
	});
});
