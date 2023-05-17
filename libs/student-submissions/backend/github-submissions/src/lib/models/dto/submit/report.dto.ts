import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { IsValidOrigin } from '../../validators/is-valid-orgin.validator';
import { GithubSubmissionDto } from './github-submission.dto';

/**
 * Data transfer object for a report.
 */
export class ReportDto {
	/**
	 * Submission details.
	 *
	 * @type {GithubSubmissionDto}
	 */
	@ValidateNested()
	@Type(() => GithubSubmissionDto)
	submission: GithubSubmissionDto;

	/**
	 * Repository name.
	 *
	 * @type {string}
	 *
	 * @example OTH-Digital-Skills/lab-04-mario-angie_123
	 */
	@IsString()
	repository: string;

	/**
	 * Actor name.
	 *
	 * @type {string}
	 *
	 * @example angie_123
	 */
	@IsString()
	actor: string;

	/**
	 * The url of the repository. It is used to determine the origin of the request.
	 *
	 * @example git://github.com/OTH-Digital-Skills/lab-04-mario-angie_123
	 */
	@IsString()
	@IsValidOrigin()
	repositoryUrl: string;
}
