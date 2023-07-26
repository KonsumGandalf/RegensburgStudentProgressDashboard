import {
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * A base entity for all other entities
 * @class
 * @name BaseEntity
 */
@Entity()
export abstract class BaseEntity {
    /**
     * The unique identifier for this entity.
     * @member {string}
     */
    @PrimaryGeneratedColumn()
    id: string;

    /**
     * The date and time when this entity was created.
     * @member {Date}
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * The date and time when this entity was last updated.
     * @member {Date}
     */
    @UpdateDateColumn()
    updatedAt: Date;
}
