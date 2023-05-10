import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { ReportDto } from '../models/dto/report.dto';
import { GithubSubmissionService } from '../services/github-submission.service';

/**
 * Controller for handling Github submissions
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
		return await this._githubSubmissionService.createSubmissionWithTests(submission);
	}
}
