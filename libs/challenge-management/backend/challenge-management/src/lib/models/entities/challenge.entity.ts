import { BaseEntity } from '@rspd/shared/backend/utils';
import { Column, Entity, OneToMany } from 'typeorm';

import { Assignment } from './assignment.entity';

/**
 * Represents a challenge that a user can complete.
 * @class
 * @extends BaseEntity
 * @name Challenge
 */
@Entity()
export class Challenge extends BaseEntity {
    /**
     * The name of the challenge.
     * @member {string}
     */
    @Column()
    name: string;

    /**
     * The date when the challenge is targeted to be completed.
     * @member {Date}
     */
    @Column({ type: 'timestamptz' })
    targetedCompletionDate: Date;

    /**
     * The list of assignments associated with this challenge.
     *
     * @type {Assignment[]}
     */
    @OneToMany(() => Assignment, (assignment) => assignment.challenge)
    assignments: Assignment[];
}
