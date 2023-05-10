import { BaseEntity, IDeleteResponse } from '@rspd/shared/backend/utils';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

/**
 * An interface for a generic repository that provides basic CRUD operations for a given entity.
 *
 * @template Entity - The entity type for this repository.
 * @template IEntity - The optional interface of entity
 */
export abstract class IGenericRepository<Entity extends BaseEntity, IEntity = any> {
	/**
	 * Creates a new entity.
	 *
	 * @param item - The entity or entity input object to create.
	 * @returns - A promise that resolves to the created entity.
	 */
	abstract create(item: Entity | IEntity): Promise<Entity>;

	/**
	 * Finds an entity by ID.
	 *
	 * @param {string} id - The ID of the entity to find.
	 * @returns - A promise that resolves to the found entity, or null if not found.
	 */
	abstract findOneById(id: string): Promise<Entity>;

	/**
	 * Finds one entity based on the given options.
	 *
	 * @param options - The options to use for the query.
	 * @returns - A promise that resolves to an array of entities that match the options.
	 */
	abstract findOptions(options: Pick<FindManyOptions, 'where' | 'relations'>): Promise<Entity>;

	/**
	 * Finds many entities based on the given options.
	 *
	 * @param options - The options to use for the query.
	 * @returns - A promise that resolves to an array of entities that match the options.
	 */
	abstract findOptionsMany(
		options: Pick<FindManyOptions, 'where' | 'relations'>,
	): Promise<Entity[]>;

	/**
	 * Finds all entities.
	 *
	 * @returns - A promise that resolves to an array of all entities.
	 */
	abstract findAll(): Promise<Entity[]>;

	/**
	 * Updates an entity by ID.
	 *
	 * @param {string} id - The ID of the entity to update.
	 * @param item - The entity or entity input object to update.
	 * @returns - A promise that resolves to the updated entity, or null if not found.
	 */
	abstract update(id: string, item: Entity | IEntity): Promise<Entity>;

	/**
	 * Deletes an entity by ID.
	 *
	 * @param {string} id - The ID of the entity to delete.
	 * @returns - A promise that resolves to an object containing the number of deleted entities and any additional information.
	 */
	abstract delete(id: string): Promise<IDeleteResponse<Entity>>;
}
