import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignmentService } from '@rspd/challenge-management/backend/challenge-management';
import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import { Student } from '@rspd/user/backend/common-models';
import { UserService } from '@rspd/user/backend/user-management';
import { Repository } from 'typeorm';

import { ReportDto } from '../models/dto/report.dto';
import { GithubSubmission } from '../models/entities/github-submission.entity';
import { GithubTestService } from './github-test.service';

/**
 * Service which creates and updates GitHub submissions
 */
@Injectable()
export class GithubSubmissionService extends GenericRepositoryService<GithubSubmission> {
	constructor(
		private readonly _userService: UserService,
		private readonly _assignmentService: AssignmentService,
		private readonly _githubTestService: GithubTestService,
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
	async createSubmissionWithTests(report: ReportDto) {
		const studentEntity = (await this._userService.findUserByUsername(report.actor)) as Student;

		const formattedUrl = report.repositoryUrl.substring(
			0,
			report.repositoryUrl.lastIndexOf('/') + 1,
		);
		const assigmentEntity = await this._assignmentService.getAssignmentByRepositoryUrl(
			formattedUrl,
		);

		const submissionEntity = await this.createOrUpdateSubmission(
			studentEntity,
			assigmentEntity,
			report,
		);

		await this._githubTestService.createOrUpdateTests(
			report.submission.tests,
			submissionEntity,
		);
	}

	/**
	 * Function for creating or updating a submission.
	 *
	 * @param student the Student entity
	 * @param assignment the Assignment entity
	 * @param report the ReportDto containing the submission data
	 * @returns the created or updated GithubSubmission entity
	 */
	async createOrUpdateSubmission(
		student: Student,
		assignment: Assignment,
		report: ReportDto,
	): Promise<GithubSubmission> {
		const foundSubmission = await super.findOptions({
			where: {
				student: {
					username: student.username,
				},
				assignment: {
					id: assignment.id,
				},
			},
			relations: ['student', 'assignment'],
		});

		if (foundSubmission) {
			return await this._githubSubmissionRepo.save({
				...foundSubmission,
				numberOfSubmissions: foundSubmission.numberOfSubmissions + 1,
			});
		}

		const duration = Math.ceil(report.submission.duration * 100);
		const completionPercentage = (
			report.submission.summary.passed / report.submission.summary.total
		).toPrecision(6);
		return await this._githubSubmissionRepo.save(
			this._githubSubmissionRepo.create({
				duration,
				student,
				completionPercentage,
				assignment,
				numberOfSubmissions: 1,
			} as unknown as GithubSubmission),
		);
	}
}
