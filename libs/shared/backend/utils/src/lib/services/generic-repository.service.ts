import { ConflictException, NotFoundException } from '@nestjs/common';
import {
	BaseEntity,
	DuplicateSourceException,
	IDeleteResponse,
	NoContentException,
} from '@rspd/shared/backend/utils';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

import { IGenericRepository } from './generic-repository.interface';

/**
 * Abstract class that provides generic CRUD operations for a TypeORM repository.
 * @template Entity The entity type of the repository.
 * @template IEntity The entity interface of the repository.
 */
export abstract class GenericRepositoryService<Entity extends BaseEntity, IEntity = any>
	implements IGenericRepository<Entity, IEntity>
{
	/**
	 * Constructor for the abstract class.
	 * @param {Repository<Entity>} _repository The TypeORM repository to be used for the generic CRUD operations.
	 */
	protected constructor(private readonly _repository: Repository<Entity>) {}

	/**
	 * Creates an entity in the repository.
	 * @param {Entity | IEntity} data The entity to be created in the repository.
	 * @param {FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]} [existingCondition] Optional condition to check for existing elements in the repository.
	 * @returns {Promise<Entity>} A promise that resolves to the created entity.
	 * @throws {DuplicateSourceException} If an existing element with the given condition is found in the repository.
	 */
	public async create(
		data: Entity | IEntity,
		existingCondition?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
	): Promise<Entity> {
		if (existingCondition) {
			const existingElement = await this._repository.findOneBy(existingCondition);
			if (existingElement) {
				throw new DuplicateSourceException(data.toString());
			}
		}

		return await this._repository.save(
			this._repository.create({
				...data,
			} as Entity),
		);
	}

	/**
	 * Finds an entity in the repository by its ID.
	 * @param {string} id The ID of the entity to be found.
	 * @returns {Promise<Entity>} A promise that resolves to the found entity.
	 * @throws {NotFoundException} If no entity is found with the given ID.
	 */
	public async findOneById(id: string): Promise<Entity> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = await this._repository.findOneBy({ id: id });
		if (!result) {
			throw new NotFoundException(`Not Result found for ${id}`);
		}
		return result;
	}

	/**
	 * Finds an entity in the repository with the given options.
	 * @param {Pick<FindManyOptions, 'where' | 'relations'>} options The options to be used for finding the entity.
	 * @returns {Promise<Entity>} A promise that resolves to the found entity.
	 */
	public async findOptions(
		options: Pick<FindManyOptions, 'where' | 'relations'>,
	): Promise<Entity> {
		return await this._repository.findOne({
			where: options.where,
			relations: options.relations,
		});
	}

	/**
	 * Finds many entities based on the given options. Find methode is meant to be used for ManyToOne
	 * and OneToMany relations.
	 *
	 * @param options - The options to use for the query.
	 * @returns - A promise that resolves to an array of entities that match the options.
	 *
	 * @throws {NoContentException} - In case no associated object was found
	 */
	public async findOptionsMany(
		options: Pick<FindManyOptions, 'where' | 'relations'>,
	): Promise<Entity[]> {
		const response = await this._repository.find({
			where: options.where,
			relations: options.relations,
		});

		if (response === undefined || response.length === 0) {
			throw new NoContentException(`No objects were found for search options'.`);
		}
		return response;
	}

	/**
	 * Finds all entities in the repository.
	 * @returns {Promise<Entity[]>} A promise that resolves to an array of all entities in the repository.
	 */
	public async findAll(): Promise<Entity[]> {
		return await this._repository.find();
	}

	/**
	 * Updates an entity in the repository.
	 * @param {string} id The ID of the
	 * @param item
	 */
	public async update(id: string, item: Entity | IEntity): Promise<Entity> {
		let entity: Entity;
		try {
			entity = await this.findOneById(id);
		} catch (NotFoundException) {
			throw new ConflictException('Id of update entity not found.');
		}

		return await this._repository.save(
			this._repository.create({
				...entity,
				...item,
				id: id,
			} as Entity),
		);
	}

	/**
	 * Deletes an entity by ID and returns information about the deletion.
	 * @param {string} id - The ID of the entity to be deleted.
	 * @returns {Promise<IDeleteResponse<Entity>>} - The deletion response object containing the number of affected rows and the deleted entity.
	 * @throws {ConflictException} - If the specified entity ID does not exist.
	 */
	public async delete(id: string): Promise<IDeleteResponse<Entity>> {
		let deletedItem: Entity;
		try {
			deletedItem = await this.findOneById(id);
		} catch (NotFoundException) {
			throw new ConflictException('Id of delete entity not found.');
		}

		const result = await this._repository.delete(id);
		return {
			affectedRows: result.affected,
			deletedElements: deletedItem,
		};
	}
}
