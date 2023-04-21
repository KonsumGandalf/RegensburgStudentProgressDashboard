import { BaseEntity } from '@rspd/shared/backend/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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
     * The primary email address of the user.
     *
     * @type {string}
     */
    @PrimaryColumn()
    email: string;

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
}
