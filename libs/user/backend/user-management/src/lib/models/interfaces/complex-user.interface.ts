import { IUser } from '@rspd/shared/backend/utils';

/**
 * Represents a user interface
 *
 * @interface
 */
export interface IComplexUser extends IUser {
    /**
     * The primary email address of the user.
     *
     * @type {string}
     */
    email: string;

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
}
