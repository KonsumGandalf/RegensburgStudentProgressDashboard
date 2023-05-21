import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoodleAssignmentService } from '@rspd/challenge-management/backend/challenge-management';
import { MoodleAssignment } from '@rspd/challenge-management/backend/common-models';
import { MoodleManagementService } from '@rspd/moodle-management/backend/moodle-management';
import { MockRepository } from '@rspd/shared/backend/test-util';
import {
	ChallengeSubmission,
	MoodleSubmission,
	SubmissionState,
} from '@rspd/student-submissions/backend/common-models';
import { ChallengeSubmissionService } from '@rspd/student-submissions/backend/submission-management';
import { Student } from '@rspd/user/backend/common-models';
import { StudentService } from '@rspd/user/backend/user-management';

import { MoodleSubmissionService } from './moodle-submission.service';

describe('MoodleSubmissionService', () => {
	let service: MoodleSubmissionService;
	let moodleManagementService: MoodleManagementService;
	let fakeAssignments: MoodleAssignment[];
	let fakeStudents: Student[];
	let fakeMoodleSubmissions: MoodleSubmission[];
	let fakeChallengeSubmissions: ChallengeSubmission[];
	let assignmentSubmissionRepository: MockRepository<MoodleSubmission>;

	beforeEach(async () => {
		fakeStudents = [];
		for (let a = 0; a < 3; a++) {
			fakeStudents.push({
				id: a.toString(),
				moodleId: a,
			} as Student);
		}

		fakeAssignments = [];
		for (let a = 0; a < 3; a++) {
			fakeAssignments.push({
				id: a.toString(),
			} as MoodleAssignment);
		}

		fakeChallengeSubmissions = [];
		for (let a = 0; a < 3; a++) {
			fakeChallengeSubmissions.push({
				id: a.toString(),
			} as ChallengeSubmission);
		}

		fakeMoodleSubmissions = [];
		for (let a = 0; a < 3; a++) {
			fakeMoodleSubmissions.push({
				id: a.toString(),
				assignment: fakeAssignments[a],
				student: fakeStudents[a],
				challengeSubmission: fakeChallengeSubmissions[a],
			} as MoodleSubmission);
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MoodleSubmissionService,
				{
					provide: MoodleAssignmentService,
					useValue: {
						findAll: jest.fn().mockResolvedValue(fakeAssignments),
					},
				},
				{
					provide: StudentService,
					useValue: {
						findAll: jest.fn().mockResolvedValue(fakeStudents),
					},
				},
				{
					provide: MoodleManagementService,
					useValue: {
						getAllAssignmentsGradesOfUsers: jest.fn().mockResolvedValue(
							new Map<number, SubmissionState>([
								[1, SubmissionState.CompletelySolved],
								[2, SubmissionState.Unsolved],
							]),
						),
					},
				},
				{
					provide: ChallengeSubmissionService,
					useValue: {
						getChallengeSubmissionByUserAssignmentId: jest
							.fn()
							.mockImplementation((id) =>
								fakeChallengeSubmissions.find((submission) => submission.id == id),
							),
						createOrUpdateChallengeSubmission: jest.fn().mockImplementation(),
					},
				},
				{
					provide: getRepositoryToken(MoodleSubmission),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(MoodleSubmissionService);
		assignmentSubmissionRepository = module.get(getRepositoryToken(MoodleSubmission));
		assignmentSubmissionRepository.entities = fakeMoodleSubmissions;
		moodleManagementService = module.get(MoodleManagementService);
	});

	describe('createOrUpdateAssignment', () => {
		it('should update the assignmentState of one students AssignmentSubmission', async () => {
			const updateSpy = jest.spyOn(service, 'update');
			const createSpy = jest.spyOn(service, 'create');

			await service.createOrUpdateAssignment(
				fakeAssignments[1],
				fakeStudents[1],
				SubmissionState.Unsolved,
			);

			expect(updateSpy).toBeCalledTimes(1);
			expect(createSpy).toBeCalledTimes(0);
			expect(updateSpy).toBeCalledWith('1', {
				id: '1',
				completionState: SubmissionState.Unsolved,
				student: fakeStudents[1],
				assignment: fakeAssignments[1],
				challengeSubmission: fakeChallengeSubmissions[1],
			} as MoodleSubmission);
		});

		it('should create a new submission if no submission was found', async () => {
			const updateSpy = jest.spyOn(service, 'update');
			const createSpy = jest.spyOn(service, 'create');
			jest.spyOn(service, 'findOptions').mockResolvedValue(undefined);

			await service.createOrUpdateAssignment(
				fakeAssignments[1],
				fakeStudents[1],
				SubmissionState.Solved,
			);

			expect(updateSpy).toBeCalledTimes(0);
			expect(createSpy).toBeCalledTimes(1);
			expect(createSpy).toBeCalledWith({
				completionState: SubmissionState.Solved,
				student: fakeStudents[1],
				assignment: fakeAssignments[1],
				challengeSubmission: fakeChallengeSubmissions[1],
			} as MoodleSubmission);
		});
	});

	describe('updateAllAssignments', () => {
		it('should call createOrUpdateAssignment for all students which have a moodleAssignment', async () => {
			const createOrUpdateAssignmentSpy = jest.spyOn(service, 'createOrUpdateAssignment');

			await service.updateAllAssignments();

			expect(createOrUpdateAssignmentSpy).toBeCalledTimes(6);
		});

		it('should call createOrUpdateAssignment 0 times when no matching student is found', async () => {
			const createOrUpdateAssignmentSpy = jest.spyOn(service, 'createOrUpdateAssignment');
			jest.spyOn(moodleManagementService, 'getAllAssignmentsGradesOfUsers').mockResolvedValue(
				new Map<number, SubmissionState>([
					[6, SubmissionState.CompletelySolved],
					[10, SubmissionState.Unsolved],
				]),
			);

			await service.updateAllAssignments();

			expect(createOrUpdateAssignmentSpy).toBeCalledTimes(0);
		});
	});
});
