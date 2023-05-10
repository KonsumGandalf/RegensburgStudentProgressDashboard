import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CrashDto } from './crash.dto';

/**
 * Represents an object describing a call associated with a test.
 */
export class CallDto {
	/**
	 * Data transfer object for a crash.
	 */
	@ValidateNested()
	@Type(() => CrashDto)
	crash: CrashDto;
}
