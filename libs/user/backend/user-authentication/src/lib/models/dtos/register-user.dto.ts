import { IsAllowEmailDomain } from '@rspd/user/backend/common-models';
import { IUserIntermediate } from '@rspd/user/common/models';
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for registering a new user
 */
export class RegisterUserDto implements IUserIntermediate {
	/**
	 * Email of the user
	 *
	 * @example angela.merkel@st.oth-regensburg.de
	 */
	@IsString()
	@IsEmail()
	@IsAllowEmailDomain()
	@MaxLength(64)
	email: string;

	/**
	 * Username of the user
	 *
	 * @example angie_123
	 */
	@IsString()
	@MinLength(7)
	@MaxLength(32)
	username: string;

	/**
	 * First name of the user
	 *
	 * @example Angela
	 */
	@IsString()
	@MinLength(3)
	@MaxLength(32)
	firstName: string;

	/**
	 * Last name of the user
	 *
	 * @example Merkel
	 */
	@IsString()
	@MinLength(3)
	@MaxLength(32)
	lastName: string;

	/**
	 * Password of the user
	 *
	 * @example RussianGas123!
	 */
	@IsString()
	@MaxLength(32)
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minSymbols: 1,
		minNumbers: 1,
	})
	password: string;
}
