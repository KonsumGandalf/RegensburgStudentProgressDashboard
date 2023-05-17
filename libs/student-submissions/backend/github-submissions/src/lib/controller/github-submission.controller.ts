import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Role, RoleGuard, UserRole } from '@rspd/shared/backend/utils';
import { GithubSubmission } from '@rspd/student-submissions/backend/common-models';

import { ManuallyCorrectionSubmissionDto } from '../models/dto/correct-test/manually-correction-submission.dto';
import { ReportDto } from '../models/dto/submit/report.dto';
import { GithubSubmissionService } from '../services/github-submission.service';

/**
 * Controller for handling GitHub submissions
 */
@ApiTags('github-submission')
@Controller('submission')
export class GithubSubmissionController {
	constructor(private readonly _githubSubmissionService: GithubSubmissionService) {}

	/**
	 * Route for receiving GitHub submission reports and creating corresponding submission records
	 *
	 * @param {ReportDto} submission - The submission report received from GitHub
	 * @returns {Promise<void>}
	 */
	@ApiCreatedResponse({ description: 'Challenge was created or updated' })
	@Post()
	async postData(@Body() submission: ReportDto) {
		return await this._githubSubmissionService.createOrUpdateSubmissionWithTests(submission);
	}

	/**
	 * Allows tutors to manually corrects a submission f.e. when it was set to a wrong outcome state.
	 *
	 * @param {ManuallyCorrectionSubmissionDto} submissionDto - The submission data for manual correction.
	 * @returns {Promise<any>} A Promise that resolves to the result of the manual correction.
	 */
	@Role(UserRole.TUTOR)
	@UseGuards(JwtAuthGuard, RoleGuard)
	@ApiOkResponse({ description: 'GithubSubmission was corrected', type: GithubSubmission })
	@Put()
	async manuallyCorrectSubmission(@Body() submissionDto: ManuallyCorrectionSubmissionDto) {
		return await this._githubSubmissionService.manuallyUpdateSubmission(submissionDto);
	}
}
