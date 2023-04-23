// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BaseEntity, GithubUser, UserRole } from '@rspd/shared/backend/utils';
import { Email } from '@rspd/user/backend/common-models';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { IComplexUser } from '../interfaces/complex-user.interface';

/**
 * Represents a user entity in the database.
 *
 * @class
 * @extends BaseEntity
 */
@Entity()
export class User extends BaseEntity implements IComplexUser {
    /**
     * The primary username of the user.
     *
     * @type {string}
     */
    @PrimaryColumn()
    username: string;

    /**
     * The first name of the user.
     *
     * @type {string}
     */
    @Column()
    firstName: string;

    /**
     * The last name of the user.
     *
     * @type {string}
     */
    @Column()
    lastName: string;

    /**
     * The hashed password of the user.
     *
     * @type {string}
     */
    @Column()
    hashedPassword: string;

    /**
     * The account of the linked user
     *
     * @type {GithubUser}
     */
    @OneToOne(() => GithubUser)
    @JoinColumn()
    githubUser: GithubUser;

    /**
     * The email linked to the account
     *
     * @type {Email}
     */
    @OneToOne(() => Email)
    @JoinColumn()
    email: Email;

    /**
     * The user roles available in the system.
     */
    @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
    role: UserRole;
}
