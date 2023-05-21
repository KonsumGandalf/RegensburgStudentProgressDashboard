import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@rspd/shared/backend/utils';

import { MoodleSubmissionService } from '../services/moodle-submission.service';

/**
 * Controller for handling Moodle submission-related endpoints.
 */
@Controller()
@ApiTags('moodle-submission')
export class MoodleSubmissionController {
	constructor(private readonly _moodleSubmissionService: MoodleSubmissionService) {}

	/**
	 * Updates all assignments of all users with the correlating grades of Moodle.
	 */
	@UseGuards(JwtAuthGuard)
	@Get('update-moodle-submissions')
	async updateAllAssignments(): Promise<void> {
		return await this._moodleSubmissionService.updateAllAssignments();
	}
}
