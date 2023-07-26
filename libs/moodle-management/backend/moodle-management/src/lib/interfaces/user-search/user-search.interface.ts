import { IUserSearchUser } from './user-search-user.interface';

/**
 * Represents the Moodle information returned in User Search - 'core_user_get_users'
 */
export interface IUserSearch {
	users: IUserSearchUser[];
}
