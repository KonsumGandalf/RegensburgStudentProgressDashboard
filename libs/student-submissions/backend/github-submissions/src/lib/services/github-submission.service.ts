import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubAssignmentService } from '@rspd/challenge-management/backend/challenge-management';
import { GithubAssignment } from '@rspd/challenge-management/backend/common-models';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import {
	GithubSubmission,
	GithubTest,
	SubmissionState,
	submissionStateCalculator,
	TestOutcome,
} from '@rspd/student-submissions/backend/common-models';
import { ChallengeSubmissionService } from '@rspd/student-submissions/backend/submission-management';
import { Student } from '@rspd/user/backend/common-models';
import { UserService } from '@rspd/user/backend/user-management';
import { Repository } from 'typeorm';

import { ManuallyCorrectionSubmissionDto } from '../models/dto/correct-test/manually-correction-submission.dto';
import { TestDto } from '../models/dto/submit/grad-test.dto';
import { ReportDto } from '../models/dto/submit/report.dto';
import { GithubTestService } from './github-test.service';

/**
 * Service which creates and updates GitHub submissions
 */
@Injectable()
export class GithubSubmissionService extends GenericRepositoryService<GithubSubmission> {
	constructor(
		private readonly _userService: UserService,
		private readonly _assignmentService: GithubAssignmentService,
		private readonly _githubTestService: GithubTestService,
		private readonly _challengeSubmissionService: ChallengeSubmissionService,
		@InjectRepository(GithubSubmission)
		private readonly _githubSubmissionRepo: Repository<GithubSubmission>,
	) {
		super(_githubSubmissionRepo);
	}

	/**
	 * Function for creating a new submission and tests.
	 *
	 * @param report the ReportDto containing the submission and test data
	 */
	async createOrUpdateSubmissionWithTests(report: ReportDto) {
		const studentEntity = (await this._userService.findUserByUsername(report.actor)) as Student;

		const formattedUrl = report.repositoryUrl.replace(`-${report.actor}`, '');
		const assigmentEntity = await this._assignmentService.getAssignmentByRepositoryUrl(
			formattedUrl,
		);

		const assignmentSubmissionEntity = await this.createOrUpdateAssignmentSubmission(
			studentEntity,
			assigmentEntity,
			report,
		);

		await this._challengeSubmissionService.createOrUpdateChallengeSubmission(
			assignmentSubmissionEntity,
		);


		await this._githubTestService.createOrUpdateTests(
			report.submission.tests,
			assignmentSubmissionEntity,
		);
	}

	async manuallyUpdateSubmission(updateDto: ManuallyCorrectionSubmissionDto) {
		const submission = await this.getSubmissionEagerly(updateDto.student, updateDto.assigment);

		const updatedTests = await this._githubTestService.manuallyUpdateTest(
			submission.tests,
			updateDto.tests,
		);
		await this.update(submission.id, {
			...submission,
			completionState: this.calculateCompletionState(
				updatedTests,
				submission.assignment.minPassedTests,
				submission.assignment.totalTests,
			),
		} as GithubSubmission);

		await this._challengeSubmissionService.createOrUpdateChallengeSubmission(submission);
	}

	async getSubmissionEagerly(username: string, name: string): Promise<GithubSubmission> {
		return await super.findOptions({
			where: {
				student: {
					username,
				},
				assignment: {
					name,
				},
			},
			relations: ['student', 'assignment', 'tests'],
		});
	}

	/**
	 * Function for creating or updating a submission.
	 *
	 * @param student the Student entity
	 * @param assignment the Assignment entity
	 * @param report the ReportDto containing the submission data
	 * @returns the created or updated GithubSubmission entity
	 */
	async createOrUpdateAssignmentSubmission(
		student: Student,
		assignment: GithubAssignment,
		report: ReportDto,
	): Promise<GithubSubmission> {
		const foundSubmission = await this.findOptions({
			where: {
				student: {
					username: student.username,
				},
				assignment: {
					name: assignment.name,
				},
			},
			relations: ['student', 'assignment'],
		});

		const duration = Math.ceil(report.submission.duration * 100);
		const completionState = this.calculateCompletionState(
			report.submission.tests,
			assignment.minPassedTests,
			assignment.totalTests,
		);

		let savedEntity;
		if (foundSubmission) {
			savedEntity = await this.update(foundSubmission.id, {
				duration,
				completionState,
				numberOfSubmissions: foundSubmission.numberOfSubmissions + 1,
			});
		} else {
			savedEntity = await this.create({
				duration,
				student,
				assignment,
				completionState,
			} as GithubSubmission);
		}

		return {
			...foundSubmission,
			...savedEntity,
		};
	}

	/**
	 * Retrieves the tests of a submission by the id of it.
	 *
	 * @param {string} id - The ID of the challenge.
	 * @returns {Promise<GithubTest[]>} A Promise that resolves to the retrieved challenge.
	 */
	async getTestsOfSubmission(id: string): Promise<GithubTest[]> {
		return await this.findOptions({
			where: {
				id,
			} as GithubSubmission,
			relations: ['tests'],
		}).then((submission) => submission.tests);
	}

	/**
	 * Calculates the state of a submission by its tests
	 *
	 * @param {Array<GithubTest | TestDto>} tests - The ID of the challenge.
	 * @param {number} minPassedTests - The number of tests that need to be solved to pass a challenge.
	 * @param {number} totalTests - The number of tests a submission has.
	 * @returns {Promise<Challenge>} A Promise that resolves to the retrieved challenge.
	 */
	calculateCompletionState(
		tests: Array<GithubTest | TestDto>,
		minPassedTests: number,
		totalTests: number,
	): SubmissionState {
		const passingTestsCount = tests.reduce((count: number, test: GithubTest | TestDto) => {
			if (test.outcome == TestOutcome.PASSED) {
				return count + 1;
			}
			return count;
		}, 0);
		return submissionStateCalculator(passingTestsCount, minPassedTests, totalTests);
	}
}
