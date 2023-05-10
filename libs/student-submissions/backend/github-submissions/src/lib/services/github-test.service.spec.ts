import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { Submission } from '@rspd/student-submissions/backend/common-models';

import { TestDto } from '../models/dto/grad-test.dto';
import { GithubTest } from '../models/entities/github-test.entity';
import { TestOutcome } from '../models/enums/test-outcome.enum';
import { GithubTestService } from './github-test.service';

describe('GithubTestService', () => {
	let service: GithubTestService;
	let githubTestRepository: MockRepository;
	let tests: GithubTest[];
	let submissionRepository: MockRepository;
	let submissions: Submission[];
	let fakeSubmission: Submission;

	beforeEach(async () => {
		tests = [];
		fakeSubmission = {
			id: 'test',
			numberOfSubmissions: 1,
			student: {
				id: 'test-student',
			},
			assignment: {
				id: 'test-assignment',
			},
		} as Submission;
		submissions = [fakeSubmission];
		for (let i = 0; i < 2; i++) {
			const test = {
				id: i.toString(),
				errorMsg: faker.lorem.words(5),
				state: faker.helpers.arrayElement(Object.values(TestOutcome)),
				failedRuns: 0,
				localId: i,
				submission: fakeSubmission,
			} as GithubTest;
			tests.push(test);
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GithubTestService,
				{
					provide: getRepositoryToken(GithubTest),
					useClass: MockRepository,
				},
				{
					provide: getRepositoryToken(Submission),
					useClass: MockRepository,
				},
			],
		}).compile();
		service = module.get(GithubTestService);
		githubTestRepository = module.get(getRepositoryToken(GithubTest));
		githubTestRepository.entities = tests;
		submissionRepository = module.get(getRepositoryToken(Submission));
		submissionRepository.entities = submissions;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('createChallenge', () => {
		let fakeSubmission: Submission;
		let previousEntityLength: number;
		const fakeTests: TestDto[] = [];

		beforeEach(() => {
			previousEntityLength = githubTestRepository.entities.length;
			fakeSubmission = {
				id: 'test',
				student: {
					id: 'test-student',
				},
				assignment: {
					id: 'test-assignment',
				},
			} as Submission;
			for (let i = 100; i < 102; i++) {
				const test = {
					outcome: TestOutcome.FAILED,
					call: {
						crash: {
							message: faker.lorem.words(5),
						},
					},
				} as TestDto;
				fakeTests.push(test);
			}
		});

		it('should create multiple new tests', async () => {
			const createdTests = await service.createOrUpdateTests(fakeTests, fakeSubmission);

			expect(githubTestRepository.entities.length).toEqual(previousEntityLength + 2);
			expect(githubTestRepository.entities.length).toEqual(4);
			expect(createdTests).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						errorMsg: fakeTests[0].call.crash.message,
						state: fakeTests[0].outcome,
						localId: 0,
						failedRuns: 1,
					}),
					expect.objectContaining({
						errorMsg: fakeTests[1].call.crash.message,
						state: fakeTests[1].outcome,
						localId: 1,
						failedRuns: 1,
					}),
				]),
			);
		});

		it('should update the existing test for a passing one', async () => {
			//first test does FAIL
			await service.createOrUpdateTests([fakeTests[0]], fakeSubmission);
			const updatedTestDto: TestDto = {
				outcome: TestOutcome.PASSED,
			};
			const updatedTests = await service.createOrUpdateTests(
				[updatedTestDto],
				fakeSubmission,
			);

			expect(updatedTests).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						state: TestOutcome.PASSED,
						localId: 0,
						failedRuns: 0,
					}),
				]),
			);
		});
	});
});
