import { UserRole } from '@rspd/shared/backend/utils';

export interface IUser {
	/**
	 * The unique id of a user
	 *
	 * @type {string}
	 */
	id: string;

	/**
	 * The primary username of the user.
	 *
	 * @type {string}
	 */
	username: string;

	/**
	 * The user roles available in the system.
	 *
	 * @type {UserRole}
	 */
	role: UserRole;
}
