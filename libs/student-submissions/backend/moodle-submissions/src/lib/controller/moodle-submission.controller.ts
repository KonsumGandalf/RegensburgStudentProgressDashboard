import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@rspd/shared/backend/utils';

import { MoodleSubmissionService } from '../services/moodle-submission.service';

@Controller()
@ApiTags('student-submission')
export class MoodleSubmissionController {
	constructor(private readonly _moodleSubmissionService: MoodleSubmissionService) {}

	@UseGuards(JwtAuthGuard)
	@Get('update-moodle-submissions')
	async getAbsoluteProgressOverview() {
		return await this._moodleSubmissionService.updateAllAssignments();
	}
}
