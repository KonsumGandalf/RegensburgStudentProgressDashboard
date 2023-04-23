import { IComplexUser } from '@rspd/user/backend/user-management';

/**
 * Interface for the request object used in login requests.
 *
 * @interface
 */
export interface IRequestLogin {
    /**
     * User object containing information about the logged in user.
     *
     * @type {IComplexUser}
     */
    user: IComplexUser;
}
