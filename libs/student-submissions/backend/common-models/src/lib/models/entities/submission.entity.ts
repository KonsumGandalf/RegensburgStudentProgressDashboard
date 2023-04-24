import { BaseEntity } from '@rspd/shared/backend/utils';
import { Student } from '@rspd/user/backend/common-models';
import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';

/**
 * Represents a Submission entity.
 *
 * @class
 * @extends BaseEntity
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Submission extends BaseEntity {
    /**
     * Number of attempts made by the student for this submission.
     *
     * @type {number}
     */
    @Column({ type: 'int2', default: 0 })
    attempts: number;

    /**
     * The student who submitted this submission.
     *
     * @type {Student}
     */
    @ManyToOne(() => Student, (student: Student) => student.submissions)
    student: Student;
}
