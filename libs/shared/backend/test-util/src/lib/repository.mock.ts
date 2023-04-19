import { BaseEntity } from '@rspd/shared/backend/utils';
import { filter, find } from 'lodash';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ObjectId } from 'typeorm/driver/mongodb/typings';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { v4 } from 'uuid';

class MockEntity extends BaseEntity {
    constructor() {
        super();
        this.id = v4();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

export class RepositoryMock<Entity extends MockEntity = MockEntity>
    implements
        Pick<
            Repository<Entity>,
            'create' | 'save' | 'findOne' | 'delete' | 'find'
        >
{
    entities: Entity[] = [];

    create(): Entity;
    create(entityLike: DeepPartial<Entity>[]): Entity[];
    create(entityLike: DeepPartial<Entity>): Entity;
    create(entityLike?: unknown): Entity | Entity[] {
        return entityLike as Entity;
    }

    save<T extends DeepPartial<Entity>>(
        entities: T[],
        options: SaveOptions & {
            reload: false;
        }
    ): Promise<T[]>;
    save<T extends DeepPartial<Entity>>(
        entities: T[],
        options?: SaveOptions
    ): Promise<(T & Entity)[]>;
    save<T extends DeepPartial<Entity>>(
        entity: T,
        options: SaveOptions & {
            reload: false;
        }
    ): Promise<T>;
    save<T extends DeepPartial<Entity>>(
        entity: T,
        options?: SaveOptions
    ): Promise<T & Entity> {
        if (Array.isArray(entity)) {
            return Promise.all(
                entity.map((v) => this.save(v, options))
            ) as Promise<T & Entity>;
        }

        const saved = {
            id: v4(),
            ...entity,
        } as Entity;
        this.entities.push(saved);

        return Promise.resolve(saved as unknown as Promise<T & Entity>);
    }

    findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
        return Promise.resolve(find(this.entities, options.where) as Entity);
    }

    find(options?: FindManyOptions<Entity>): Promise<Entity[] | null> {
        return Promise.resolve(
            filter(this.entities, options.where) as Entity[]
        );
    }

    delete(
        criteria:
            | string
            | string[]
            | number
            | number[]
            | Date
            | Date[]
            | ObjectId
            | ObjectId[]
            | FindOptionsWhere<Entity>
    ): Promise<DeleteResult> {
        const entitiesToDelete = this.entities.filter((entity: Entity) => {
            if (
                typeof criteria === 'string' ||
                typeof criteria === 'number' ||
                criteria instanceof Date
            ) {
                return entity.id === criteria.toString();
            } else if (Array.isArray(criteria)) {
                return criteria.includes(entity.id as unknown as never);
            } else {
                const properties = Object.keys(criteria);
                return properties.every(
                    (prop) => entity[prop] === criteria[prop]
                );
            }
        });

        const numDeleted = entitiesToDelete.length;
        this.entities = this.entities.filter(
            (entity) => !entitiesToDelete.includes(entity)
        );

        return Promise.resolve({ affected: numDeleted } as DeleteResult);
    }
}
