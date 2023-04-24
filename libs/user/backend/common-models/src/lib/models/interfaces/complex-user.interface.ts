import { UserRole } from '@rspd/shared/backend/utils';
import { IEmail, IUser } from '@rspd/user/backend/common-models';

/**
 * Represents a user interface
 *
 * @interface
 */
export interface IComplexUser extends IUser {
    /**
     * The id of a user
     *
     * @type {string}
     */
    id: string;

    /**
     * The email address of the user.
     *
     * @type {Email}
     */
    email: IEmail;

    /**
     * The primary username of the user.
     *
     * @type {string}
     */
    username: string;

    /**
     * The first name of the user.
     *
     * @type {string}
     */
    firstName: string;

    /**
     * The last name of the user.
     *
     * @type {string}
     */
    lastName: string;

    /**
     * The hashed password of the user.
     *
     * @type {string}
     */
    hashedPassword: string;

    /**
     * The user roles available in the system.
     */
    role: UserRole;
}
