// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BaseEntity, UserRole } from '@rspd/shared/backend/utils';
import { Email } from '@rspd/user/backend/common-models';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    TableInheritance,
} from 'typeorm';

import { IComplexUser } from '../interfaces/complex-user.interface';

/**
 * Represents a user entity in the database.
 *
 * @class
 * @extends BaseEntity
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
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
