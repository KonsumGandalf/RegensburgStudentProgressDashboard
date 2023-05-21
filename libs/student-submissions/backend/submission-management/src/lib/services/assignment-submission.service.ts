import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import {
	AssignmentSubmission,
	GithubSubmission,
	GithubTest,
	SubmissionState,
	TestOutcome,
} from '@rspd/student-submissions/backend/common-models';
import { ISubmissionServices } from '@rspd/student-submissions/backend/common-models';
import { In, Repository } from 'typeorm';

/**
 * Service for managing assignment submissions.
 */
@Injectable()
export class AssignmentSubmissionService
	extends GenericRepositoryService<AssignmentSubmission>
	implements ISubmissionServices<AssignmentSubmission>
{
	constructor(
		@InjectRepository(AssignmentSubmission)
		private readonly _challengeSubmissionRepository: Repository<AssignmentSubmission>,
	) {
		super(_challengeSubmissionRepository);
	}

	/**
	 * Retrieves all assignment submissions solved by a specific user.
	 * @param username The username of the user.
	 * @returns A Promise that resolves to an array of AssignmentSubmission entities.
	 */
	async getUserSolvedElements(username: string) {
		return await this.findOptionsMany({
			where: {
				student: {
					username,
				},
				completionState: In([SubmissionState.Solved, SubmissionState.CompletelySolved]),
			},
			relations: ['assignment'],
		});
	}

	/**
	 * Retrieves all assignment submissions that are completely solved.
	 * @returns A Promise that resolves to an array of AssignmentSubmission entities.
	 */
	async getAllSolvedSubmissions(assignmentName: string): Promise<AssignmentSubmission[]> {
		return await this.findOptionsMany({
			where: {
				assignment: {
					name: assignmentName,
				},
				completionState: In([SubmissionState.Solved, SubmissionState.CompletelySolved]),
			},
			relations: ['student'],
		});
	}

	/**
	 * Retrieves the submission of a specific user for a given assignment.
	 * @param username The username of the user.
	 * @param assignmentName The name of the assignment.
	 * @returns A Promise that resolves to the AssignmentSubmission entity.
	 */
	async getSubmissionOfUser(username: string, assignmentName: string) {
		return await this.findOptions({
			where: {
				student: {
					username,
				},
				assignment: {
					name: assignmentName,
				},
			} as AssignmentSubmission,
			relations: ['student', 'assignment', 'tests'],
		});
	}
}
