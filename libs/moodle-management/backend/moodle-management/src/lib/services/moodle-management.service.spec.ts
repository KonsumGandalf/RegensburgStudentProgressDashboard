import { Test, TestingModule } from '@nestjs/testing';
import { MoodleRequestHandlerService } from '@rspd/moodle-management/backend/moodle-request-handler';
import { SubmissionState } from '@rspd/student-submissions/backend/common-models';

import { MoodleManagementService } from './moodle-management.service';

describe('MoodleManagementService', () => {
	let service: MoodleManagementService;
	let requestService: MoodleRequestHandlerService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MoodleManagementService,
				{
					provide: MoodleRequestHandlerService,
					useValue: {
						get: jest.fn().mockImplementation(async (wsfunction: string, args) => args),
					},
				},
			],
		}).compile();

		service = module.get(MoodleManagementService);
		requestService = module.get(MoodleRequestHandlerService);
	});

	describe('getUserByEmail', () => {
		it('should return the found user', async () => {
			jest.spyOn(requestService, 'get').mockResolvedValue({
				users: [
					{
						id: 1,
						name: 'test-name',
						email: 'test-mail',
					},
				],
			});

			const user = await service.getUserByEmail('test@example.com');

			expect(user.id).toEqual(1);
		});
	});

	describe('getAssignmentsWithCourse', () => {
		it('should return the searched course with its assignments', async () => {
			const expectedCourse = {
				courses: [
					{
						id: 2,
						fullname: 'Digital Skill year 1',
						assignments: [
							{
								id: 1,
								name: 'scratch 1',
							},
							{
								id: 2,
								name: 'scratch 2',
							},
						],
					},
				],
			};
			jest.spyOn(requestService, 'get').mockResolvedValue(expectedCourse);

			const course = await service.getAssignmentsWithCourse(2);

			expect(course).toMatchObject(expectedCourse.courses[0]);
		});
	});

	describe('getGradesOfAssignment', () => {
		it('should return the grades of an assignment', async () => {
			const expectedAssignment = {
				assignments: [
					{
						assignmentid: 2,
						grades: [
							{
								id: 3,
								userid: 2,
								grader: 2,
								grade: '2.00000',
							},
							{
								id: 4,
								userid: 3,
								grader: 2,
								grade: '1.00000',
							},
						],
					},
				],
			};
			jest.spyOn(requestService, 'get').mockResolvedValue(expectedAssignment);

			const grades = await service.getGradesOfAssignment(2);

			expect(expectedAssignment.assignments[0].grades).toMatchObject(grades);
		});
	});

	describe('getAllAssignmentsGradesOfUsers', () => {
		it('should correctly assign every found user a grade of the assignment', async () => {
			const interalUsersGradeMap = new Map<number, number>([
				[1, 0],
				[2, 0],
				[3, 0],
				[6, 0],
			]);

			const expectedAssignment = {
				assignments: [
					{
						assignmentid: 2,
						grades: [
							{
								id: 3,
								userid: 2,
								grader: 2,
								grade: '2.00000',
							},
							{
								id: 4,
								userid: 3,
								grader: 2,
								grade: '1.00000',
							},
						],
					},
				],
			};
			jest.spyOn(requestService, 'get').mockResolvedValue(expectedAssignment);

			const grades = await service.getAllAssignmentsGradesOfUsers(2, interalUsersGradeMap);

			expect(grades).toMatchObject(
				new Map<number, SubmissionState>([
					[2, SubmissionState.CompletelySolved],
					[3, SubmissionState.Unsolved],
				]),
			);
		});
	});
});
