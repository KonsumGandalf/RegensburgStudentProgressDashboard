import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChallengeService } from '@rspd/challenge-management/backend/challenge-management';
import { MockRepository } from '@rspd/shared/backend/test-util';
import {
	AssignmentSubmission,
	SubmissionState,
} from '@rspd/student-submissions/backend/common-models';

import { AssignmentSubmissionService } from './assignment-submission.service';

describe('ChallengeService', () => {
	let service: AssignmentSubmissionService;
	let assignmentSubmissionRepository: MockRepository<AssignmentSubmission>;
	let submissions: AssignmentSubmission[];
	let fakeSubmission: AssignmentSubmission;
	let fakeUsername: string;

	beforeEach(async () => {
		submissions = [];
		fakeUsername = faker.internet.userName();
		for (let i = 0; i < 5; i++) {
			submissions.push({
				id: i.toString(),
				student: {
					username: fakeUsername,
				},
				completionState: SubmissionState.Unsolved,
			} as AssignmentSubmission);
		}
		submissions[0].completionState = SubmissionState.CompletelySolved;
		submissions[1].completionState = SubmissionState.Solved;
		fakeSubmission = submissions[0];

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssignmentSubmissionService,
				{
					provide: getRepositoryToken(AssignmentSubmission),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(AssignmentSubmissionService);
		assignmentSubmissionRepository = module.get(getRepositoryToken(AssignmentSubmission));
		assignmentSubmissionRepository.entities = submissions;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('getUserSolvedElements', () => {
		it('should return all 2 solved `AssignmentSubmissions` of a user', async () => {
			jest.spyOn(service, 'findOptionsMany').mockResolvedValueOnce(
				assignmentSubmissionRepository.entities.filter(
					(ele) =>
						ele.completionState == SubmissionState.Solved ||
						ele.completionState == SubmissionState.CompletelySolved,
				),
			);

			const results = await service.getUserSolvedElements(fakeUsername);

			expect(results.length).toBe(2);
		});
	});
});
