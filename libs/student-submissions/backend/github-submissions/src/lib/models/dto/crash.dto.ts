import { IsString } from 'class-validator';

/**
 * Data transfer object for a crash.
 */
export class CrashDto {
	/**
	 * Represents the error message
	 *
	 * @example AssertionError: falsche Nummer\nassert 'Hello World!' == 'Hello World2!
	 */
	@IsString()
	message: string;
}
