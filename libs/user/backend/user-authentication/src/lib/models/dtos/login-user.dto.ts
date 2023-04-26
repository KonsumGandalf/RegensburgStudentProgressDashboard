import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for login user information.
 */
export class LoginUserDto {
	/**
	 * The username of the user to login.
	 * @example angie_123
	 */
	@IsString()
	@MinLength(7)
	@MaxLength(32)
	username: string;

	/**
	 * The password of the user to login.
	 * @example RussianGas123!
	 */
	@IsString()
	@MinLength(7)
	@MaxLength(32)
	password: string;
}
