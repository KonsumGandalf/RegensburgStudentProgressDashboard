import {
    AssignmentTopic,
    AssignmentType,
    BaseEntity,
} from '@rspd/shared/backend/utils';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Challenge } from './challenge.entity';

/**
 * Represents an assignment entity.
 * @class
 * @extends BaseEntity
 */
@Entity()
export class Assignment extends BaseEntity {
    /**
     * The name of the assignment.
     * @type {string}
     */
    @Column()
    name: string;

    /**
     * The type of the assignment.
     * @type {AssignmentType}
     */
    @Column({ type: 'enum', enum: AssignmentType })
    type: AssignmentType;

    /**
     * The ID of the challenge the assignment belongs to.
     * @type {string}
     */
    @Column()
    challengeId: string;

    /**
     * The challenge the assignment belongs to.
     * @type {Challenge}
     */
    @ManyToOne(() => Challenge, (challenge) => challenge.assignments)
    challenge: Challenge;

    /**
     * The topics associated with the assignment.
     * @type {AssignmentTopic[]}
     */
    @Column({ type: 'enum', enum: AssignmentTopic, array: true })
    topics: AssignmentTopic[];

    /**
     * The URL of the repository for the assignment.
     * @type {URL}
     *
     * @example https://github.com/
     */
    @Column({ type: 'varchar' })
    repositoryUrl: URL;

    /**
     * The URL of the tutors for the assignment.
     * @type {URL}
     *
     * @example https://reader.tutors.dev/
     */
    @Column({ type: 'varchar' })
    tutorsUrl: URL;

    /**
     * The minimum number of tests that must pass for the assignment to be considered successful.
     * @type {number}
     */
    @Column({ type: 'smallint' })
    minPassedTests: number;

    /**
     * The total number of tests for the assignment.
     * @type {number}
     */
    @Column({ type: 'smallint' })
    totalTests: number;
}
