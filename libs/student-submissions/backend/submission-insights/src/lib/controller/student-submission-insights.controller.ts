import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@rspd/shared/backend/utils';
import { IAssignmentDetail, IChallengesOverview } from '@rspd/student-submissions/common/models';
import { IRequestLogin } from '@rspd/user/backend/common-models';

import { StudentSubmissionInsightsService } from '../services/student-submission-insights.service';

/**
 * Retrieves the challenge overview for a student.
 */
@Controller()
@ApiTags('student-submission')
export class StudentSubmissionInsightsController {
	constructor(private readonly _submissionService: StudentSubmissionInsightsService) {}

	/**
	 * Retrieves the absolute progress figures for a specific user.
	 *
	 * @param request - The request object containing user information.
	 * @returns The challenge overview.
	 */
	@UseGuards(JwtAuthGuard)
	@Get('absolute-progress-overview')
	async getAbsoluteProgressOverview(@Request() request: IRequestLogin) {
		return await this._submissionService.getAbsoluteProgressOverview(request.user.username);
	}

	/**
	 * Retrieves an overview for all challenges for the requesting user.
	 *
	 * @param request - The request object containing user information.
	 * @returns The challenge overview.
	 */
	@UseGuards(JwtAuthGuard)
	@Get('challenge-overview')
	async getChallengeOverview(@Request() request: IRequestLogin): Promise<IChallengesOverview> {
		return await this._submissionService.getChallengeOverview(request.user.username);
	}

	/**
	 * Retrieves all information about the different types of assignment submissions f.e. GithubSubmission
	 * and transforms them to the interface `IAssignmentOverview`
	 *
	 * @param request - The request object containing user information.
	 * @param name - The name of the assignment.
	 * @returns The assignment submission details.
	 */
	@UseGuards(JwtAuthGuard)
	@Get('assignments/:name')
	async getAssignmentSubmissionDetails(
		@Request() request: IRequestLogin,
		@Param('name') name: string,
	): Promise<IAssignmentDetail> {
		console.log(name);
		return await this._submissionService.getAssignmentSubmissionDetails(
			request.user.username,
			name,
		);
	}
}
