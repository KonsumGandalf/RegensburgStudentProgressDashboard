import { UserRole } from '../../../../../../../shared/backend/utils/src/lib/models/enums/user-role.enum';

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
