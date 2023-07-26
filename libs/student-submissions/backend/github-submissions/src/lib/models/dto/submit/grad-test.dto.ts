import { TestOutcome } from '@rspd/student-submissions/backend/common-models';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';

import { CallDto } from './call.dto';

/**
 * Represents a test case with an outcome and an optional call object.
 */
export class TestDto {
	/**
	 * Enum representing the possible outcomes of a test.
	 *
	 * @enum {TestOutcome}
	 */
	@IsEnum(TestOutcome)
	outcome: TestOutcome;

	/**
	 * An optional call object associated with the test.
	 *
	 * @type {CallDto}
	 * @memberof TestDto
	 */
	@IsOptional()
	@ValidateNested()
	@Type(() => CallDto)
	call?: CallDto;
}
