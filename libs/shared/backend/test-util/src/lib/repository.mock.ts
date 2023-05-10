import { BaseEntity } from '@rspd/shared/backend/utils';
import { filter, find } from 'lodash';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ObjectId } from 'typeorm/driver/mongodb/typings';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
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

export class MockRepository<Entity extends MockEntity = MockEntity>
	implements
		Pick<Repository<Entity>, 'create' | 'save' | 'findOne' | 'delete' | 'find' | 'findOneBy'>
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
		},
	): Promise<T[]>;
	save<T extends DeepPartial<Entity>>(
		entities: T[],
		options?: SaveOptions,
	): Promise<(T & Entity)[]>;
	save<T extends DeepPartial<Entity>>(
		entity: T,
		options: SaveOptions & {
			reload: false;
		},
	): Promise<T>;
	save<T extends DeepPartial<Entity>>(entity: T, options?: SaveOptions): Promise<T & Entity> {
		if (Array.isArray(entity)) {
			return Promise.all(entity.map((v) => this.save(v, options))) as Promise<T & Entity>;
		}

		let foundElement = {};
		if (entity.id) {
			foundElement = this.entities.filter((item) => entity.id !== item.id);
			if (Array.isArray(foundElement)) {
				foundElement = foundElement[0];
			}
		}
		const saved = {
			id: v4(),
			...foundElement,
			...entity,
		} as Entity;
		this.entities.push(saved);

		return Promise.resolve(saved as unknown as Promise<T & Entity>);
	}

	async findOne(options?: FindManyOptions<Entity>): Promise<Entity | null> {
		const entities = options?.where ? filter(this.entities, options.where) : this.entities;

		const entity = entities[0];

		if (!entity) {
			return null;
		}

		return entity;
	}

	findOneBy(
		where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
	): Promise<Entity | null> {
		if (Array.isArray(where)) {
			const results: Entity[] = [];
			for (const option of where) {
				const result = find(this.entities, option) as Entity | undefined;
				if (result) {
					results.push(result);
				}
			}
			if (results.length === 0) {
				return Promise.resolve(null);
			} else {
				return Promise.resolve(results[0]);
			}
		} else {
			return Promise.resolve(find(this.entities, where) as Entity);
		}
	}

	find(options?: FindManyOptions<Entity>): Promise<Entity[] | null> {
		const entities = options?.where ? filter(this.entities, options.where) : this.entities;

		const result = options?.relations
			? entities.map((entity) => {
					const relationEntities = {};

					if (Array.isArray(options.relations)) {
						for (const relation of options.relations) {
							relationEntities[relation] = [];
						}

						for (const relation of options.relations) {
							const relationData = entity[relation];
							if (Array.isArray(relationData)) {
								relationEntities[relation] = relationData.map((relationEntity) =>
									this.entities.find((e) => e.id === relationEntity.id),
								);
							} else {
								relationEntities[relation] = this.entities.find(
									(e) => e.id === relationData.id,
								);
							}
						}

						return {
							...entity,
							...relationEntities,
						};
					}
			  })
			: entities;

		return Promise.resolve(result as Entity[]);
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
			| FindOptionsWhere<Entity>,
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
				return properties.every((prop) => entity[prop] === criteria[prop]);
			}
		});

		const numDeleted = entitiesToDelete.length;
		this.entities = this.entities.filter((entity) => !entitiesToDelete.includes(entity));

		return Promise.resolve({ affected: numDeleted } as DeleteResult);
	}
}
