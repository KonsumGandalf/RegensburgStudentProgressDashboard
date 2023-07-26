import { TestOutcome } from '@rspd/student-submissions/backend/common-models';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * DTO for manually correcting a test.
 */
export class ManuallyUpdateTestDto {
	/**
	 * The id of the test inside a submit
	 */
	@IsNumber()
	localId: number;

	/**
	 * Outcome state of a test which should be manually corrected
	 *
	 * @enum {TestOutcome}
	 */
	@IsEnum(TestOutcome)
	outcome: TestOutcome;

	@IsOptional()
	@IsString()
	errorMsg: string = null;
}
