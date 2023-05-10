import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { IsValidOrgin } from '../validators/is-valid-orgin.validator';
import { SubmissionDto } from './submission.dto';

/**
 * Data transfer object for a report.
 */
export class ReportDto {
	/**
	 * Submission details.
	 *
	 * @type {SubmissionDto}
	 */
	@ValidateNested()
	@Type(() => SubmissionDto)
	submission: SubmissionDto;

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
	@IsValidOrgin()
	repositoryUrl: string;
}
