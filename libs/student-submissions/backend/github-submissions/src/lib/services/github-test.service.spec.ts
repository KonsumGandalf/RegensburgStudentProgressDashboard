import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '@rspd/shared/backend/test-util';
import {
	AssignmentSubmission,
	GithubSubmission,
	GithubTest,
} from '@rspd/student-submissions/backend/common-models';
import { TestOutcome } from '@rspd/student-submissions/backend/common-models';

import { ManuallyUpdateTestDto } from '../models/dto/correct-test/manually-update-test.dto';
import { TestDto } from '../models/dto/submit/grad-test.dto';
import { GithubTestService } from './github-test.service';

describe('GithubTestService', () => {
	let service: GithubTestService;
	let githubTestRepository: MockRepository;
	let tests: GithubTest[];
	let submissionRepository: MockRepository;
	let submissions: AssignmentSubmission[];
	let fakeSubmission: AssignmentSubmission;

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
		} as GithubSubmission;
		submissions = [fakeSubmission];
		for (let i = 0; i < 2; i++) {
			const test = {
				id: i.toString(),
				errorMsg: faker.lorem.words(5),
				outcome: faker.helpers.arrayElement(Object.values(TestOutcome)),
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
					provide: getRepositoryToken(AssignmentSubmission),
					useClass: MockRepository,
				},
			],
		}).compile();
		service = module.get(GithubTestService);
		githubTestRepository = module.get(getRepositoryToken(GithubTest));
		githubTestRepository.entities = tests;
		submissionRepository = module.get(getRepositoryToken(AssignmentSubmission));
		submissionRepository.entities = submissions;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('createOrUpdateTests', () => {
		let fakeSubmission: AssignmentSubmission;
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
			} as AssignmentSubmission;
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
			jest.spyOn(service, 'findOptions').mockResolvedValueOnce(undefined);
			const createSpy = jest.spyOn(service, 'create');
			const createdTests = await service.createOrUpdateTests(fakeTests, fakeSubmission);

			expect(createSpy).toHaveBeenCalledTimes(1);
			expect(githubTestRepository.entities.length).toEqual(previousEntityLength + 2);
			expect(githubTestRepository.entities.length).toEqual(4);
			expect(createdTests).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						errorMsg: fakeTests[0].call.crash.message,
						outcome: fakeTests[0].outcome,
						localId: 0,
						failedRuns: 1,
					}),
					expect.objectContaining({
						errorMsg: fakeTests[1].call.crash.message,
						outcome: fakeTests[1].outcome,
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
			const createSpy = jest.spyOn(service, 'create');

			const updatedTests = await service.createOrUpdateTests(
				[updatedTestDto],
				fakeSubmission,
			);

			expect(createSpy).toHaveBeenCalledTimes(0);
			expect(updatedTests).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						outcome: TestOutcome.PASSED,
						localId: 0,
						failedRuns: 0,
					}),
				]),
			);
		});
	});

	describe('manuallyUpdateTest', () => {
		let manuallyUpdateTest: ManuallyUpdateTestDto;
		beforeEach(() => {
			manuallyUpdateTest = {
				outcome: TestOutcome.PASSED,
				localId: 1,
				errorMsg: undefined,
			} as ManuallyUpdateTestDto;
		});

		it('should update the outcome of an existing test', async () => {
			const updateSpy = jest.spyOn(service, 'update');

			const updatedTests = await service.manuallyUpdateTest(tests, [manuallyUpdateTest]);

			expect(updateSpy).toHaveBeenCalledTimes(1);
			expect(updateSpy).toHaveBeenCalledWith(tests[1].id, {
				...tests[1],
				...manuallyUpdateTest,
			});
			expect(updatedTests).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						outcome: TestOutcome.PASSED,
						localId: 1,
					}),
				]),
			);
		});

		it('should not update a test if the local ID does not exist', async () => {
			manuallyUpdateTest.localId = 129;
			const updateSpy = jest.spyOn(service, 'update');

			const result = await service.manuallyUpdateTest(tests, [manuallyUpdateTest]);

			expect(updateSpy).toHaveBeenCalledTimes(0);
			expect(result).toEqual([]);
		});
	});
});
