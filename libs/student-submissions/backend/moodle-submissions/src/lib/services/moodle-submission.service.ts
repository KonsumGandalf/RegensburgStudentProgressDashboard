import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodleAssignmentService } from '@rspd/challenge-management/backend/challenge-management';
import { MoodleAssignment } from '@rspd/challenge-management/backend/common-models';
import { MoodleManagementService } from '@rspd/moodle-management/backend/moodle-management';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import { MoodleSubmission, SubmissionState } from '@rspd/student-submissions/backend/common-models';
import { ChallengeSubmissionService } from '@rspd/student-submissions/backend/submission-management';
import { Student } from '@rspd/user/backend/common-models';
import { StudentService } from '@rspd/user/backend/user-management';
import { Repository } from 'typeorm';

@Injectable()
export class MoodleSubmissionService extends GenericRepositoryService<MoodleSubmission> {
	constructor(
		private readonly _moodleAssignmentService: MoodleAssignmentService,
		private readonly _challengeSubmissionService: ChallengeSubmissionService,
		private readonly _studentService: StudentService,
		private readonly _moodleManagementService: MoodleManagementService,
		@InjectRepository(MoodleSubmission)
		private readonly _assignmentSubmissionRepository: Repository<MoodleSubmission>,
	) {
		super(_assignmentSubmissionRepository);
	}

	/**
	 * Updates all assignments of all users with the correlating grades of Moodle.
	 * The cron expression is set to run every 10 minutes between 7 AM and 8 PM, Monday to Friday.
	 */
	@Cron('* */5 7-20 * * 1-5')
	async updateAllAssignments(): Promise<void> {
		const assignments = await this._moodleAssignmentService.findAll();
		const students = await this._studentService.findAll();

		for (const assignment of assignments) {
			const userGradeMap: Map<number, number> = students.reduce((acc, item) => {
				acc.set(item.moodleId, 1);
				return acc;
			}, new Map<number, number>());

			const assignmentGrades =
				await this._moodleManagementService.getAllAssignmentsGradesOfUsers(
					assignment.moodleAssignmentId,
					userGradeMap,
				);

			await Promise.all(
				Array.from(assignmentGrades.entries()).map(async ([key, value]) => {
					const student = students.find((student) => student.moodleId == key);

					if (student) {
						const moodleSubmission = await this.createOrUpdateAssignment(
							assignment,
							student,
							value,
						);
						await this._challengeSubmissionService.createOrUpdateChallengeSubmission(
							moodleSubmission,
						);
					}
				}),
			);
		}
	}

	/**
	 * Creates or updates an assignment for a student with the moodle data.
	 *
	 * @param {MoodleAssignment} assignment - The assignment object.
	 * @param {Student} student - The student object.
	 * @param {SubmissionState} submissionState - The submission state of the assignment.
	 */
	async createOrUpdateAssignment(
		assignment: MoodleAssignment,
		student: Student,
		submissionState: SubmissionState,
	): Promise<MoodleSubmission> {
		const foundSubmission = await this.findOptions({
			where: {
				assignment: {
					id: assignment.id,
				},
				student: {
					id: student.id,
				},
			} as MoodleSubmission,
			relations: ['student', 'assignment', 'challengeSubmission'],
		});
		if (foundSubmission) {
			return await this.update(foundSubmission.id, {
				...foundSubmission,
				completionState: submissionState,
			} as MoodleSubmission);
		} else {
			const challengeSubmission =
				await this._challengeSubmissionService.getChallengeSubmissionByUserAssignmentId(
					assignment.id,
					student.username,
				);
			return await this.create({
				completionState: submissionState,
				student: student,
				assignment: assignment,
				challengeSubmission: challengeSubmission,
			} as MoodleSubmission);
		}
	}
}
