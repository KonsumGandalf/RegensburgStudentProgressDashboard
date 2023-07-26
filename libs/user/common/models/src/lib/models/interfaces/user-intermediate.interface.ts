/**
 * Interface for registering a new user
 */
export interface IUserIntermediate {
	/**
	 * Email of the user
	 */
	email: string;

	/**
	 * Username of the user
	 */
	username: string;

	/**
	 * First name of the user
	 */
	firstName: string;

	/**
	 * Last name of the user
	 */
	lastName: string;

	/**
	 * Password of the user
	 */
	password?: string;
}
