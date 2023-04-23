import { IComplexUser } from '@rspd/user/backend/user-management';

/**
 * An interface representing an authenticated user, including their user object and password.
 *
 * @interface
 * @property {IComplexUser} user - The user object.
 * @property {string} password - The user's password.
 */
export interface IAuthUser {
    user: IComplexUser;
    password: string;
}
