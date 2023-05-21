import { Injectable } from '@nestjs/common';
import { MoodleRequestHandlerService } from '@rspd/moodle-management/backend/moodle-request-handler';
import { SubmissionState } from '@rspd/student-submissions/backend/common-models';

import { ICourseSearch } from '../interfaces/course-search-assignments/course-search.interface';
import { IMoodleCourse } from '../interfaces/course-search-assignments/moodle-course.interface';
import { IAssignmentGradeSearch } from '../interfaces/grade/assignment-grade-search.interface';
import { IMoodleGrade } from '../interfaces/grade/moodle-grade.interface';
import { IUserSearch } from '../interfaces/user-search/user-search.interface';
import { IUserSearchUser } from '../interfaces/user-search/user-search-user.interface';

@Injectable()
export class MoodleManagementService {
	constructor(private readonly _moodleRequestHandlerService: MoodleRequestHandlerService) {}

	/**
	 * Returns information of a user stored by moodle.
	 *
	 * @param email - The email of the student
	 * @returns {Promise<IUserSearchUser>} A promise that resolves to the Moodle user.
	 */
	async getUserByEmail(email: string): Promise<IUserSearchUser> {
		const response = await this._moodleRequestHandlerService.get<IUserSearch>(
			'core_user_get_users',
			{
				'criteria[0][key]': 'email',
				'criteria[0][value]': email,
			},
		);

		return response?.users[0];
	}

	/**
	 * Returns all assignments which are part of the dedicated course.
	 *
	 * @param id - The ID of the course
	 * @returns {Promise<IMoodleCourse>} A promise that resolves to the Moodle course object containing the assignments.
	 */
	async getAssignmentsWithCourse(id: number): Promise<IMoodleCourse> {
		const response = await this._moodleRequestHandlerService.get<ICourseSearch>(
			'mod_assign_get_assignments',
			{
				courseids: [id],
			},
		);

		return response?.courses[0];
	}

	/**
	 * TODO no usage pls delete in case no usage is needed till ticket #35
	 */
	async findAssignmentsOfMoodle(
		courseId: number,
		assignmentNameId: Map<string, number>,
	): Promise<Map<string, number>> {
		const course = await this.getAssignmentsWithCourse(courseId);
		for (const name of Object.keys(assignmentNameId)) {
			assignmentNameId.set(
				name,
				course.assignments.find((assignment) => assignment.name == name).grade,
			);
		}
		return assignmentNameId;
	}

	/**
	 * Returns all grades of a moodle assignment.
	 *
	 * @param assignmentId
	 * @returns {Promise<IMoodleGrade[]>} A promise that resolves to the Moodle grades
	 */
	async getGradesOfAssignment(assignmentId: number): Promise<IMoodleGrade[]> {
		const response = await this._moodleRequestHandlerService.get<IAssignmentGradeSearch>(
			'mod_assign_get_grades',
			{
				assignmentids: [assignmentId],
			},
		);

		if (response && response?.assignments[0] && response.assignments[0].grades) {
			return response.assignments[0].grades;
		}
		return [];
	}

	/**
	 * Transforms the moodle external grade value to an internal SubmissionState
	 *
	 * @param {number} assignmentId - The ID of the assignment.
	 * @param {Map<number, number>} studentAssignmentGrades - A map containing the grades of students for the assignment.
	 * @returns {Promise<Map<number, SubmissionState> | undefined>} A promise that resolves to a map associating the user IDs with their submission states or undefined if the grades are not available.
	 */
	async getAllAssignmentsGradesOfUsers(
		assignmentId: number,
		studentAssignmentGrades: Map<number, number>,
	): Promise<Map<number, SubmissionState> | undefined> {
		const gradesOfAssignment = await this.getGradesOfAssignment(assignmentId);

		const returnMap = new Map<number, SubmissionState>();
		if (Array.isArray(gradesOfAssignment)) {
			for (const grade of gradesOfAssignment) {
				if (studentAssignmentGrades.get(grade.userid) != undefined) {
					if (+grade.grade == 2) {
						returnMap.set(grade.userid, SubmissionState.CompletelySolved);
					} else {
						returnMap.set(grade.userid, SubmissionState.Unsolved);
					}
				}
			}
		}
		return returnMap;
	}
}
