import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ResourceOwnerGuard } from '@rspd/shared/backend/utils';

import { SubmissionService } from '../services/submission.service';

@Controller()
@ApiTags('submission')
export class SubmissionController {
	constructor(private readonly _submissionService: SubmissionService) {}

	@UseGuards(JwtAuthGuard, ResourceOwnerGuard)
	@Get(':id')
	async getSubmission(@Param('id') id: string) {
		return await this._submissionService.find(id);
	}
}
