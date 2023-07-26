import { AssignmentTopic, AssignmentType } from '@rspd/shared/backend/utils';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

/**
 * Data transfer object for representing an assignment.
 */
export class AssignmentDto {
	/**
	 * The type of the assignment.
	 * @type {AssignmentType}
	 */
	@IsEnum(AssignmentType)
	type: AssignmentType;

	/**
	 * The name of the assignment.
	 * @type {string}
	 *
	 * @example lab-04-mario
	 */
	@IsString()
	@Transform(({ value }) => value.trim())
	displayName: string;

	/**
	 * The topics of the assignment.
	 * @type {AssignmentTopic[]}
	 */
	@IsOptional()
	@IsEnum(AssignmentTopic, { each: true })
	topics: AssignmentTopic[];

	/**
	 * The URL of the repository for the assignment.
	 * @type {URL}
	 *
	 * @example git://github.com/OTH-Digital-Skills/lab-04-mario-angie_123
	 */
	@IsString()
	repositoryUrl: string;

	/**
	 * The URL of the tutors for the assignment.
	 * @type {URL}
	 * @example https://reader.tutors.dev/
	 */
	@IsUrl()
	tutorsUrl: URL;
}
