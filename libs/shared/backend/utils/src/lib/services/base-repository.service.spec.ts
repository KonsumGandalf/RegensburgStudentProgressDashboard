import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '@rspd/shared/backend/test-util';
import { DuplicateSourceException, IDeleteResponse } from '@rspd/shared/backend/utils';

import { BaseService, TestEntity } from './base-repository.service';

describe('UserService', () => {
	let service: BaseService;
	let entities: TestEntity[];
	let testEntity: TestEntity;
	let testRepository: MockRepository<TestEntity>;

	beforeEach(async () => {
		entities = [];
		for (let i = 0; i < 3; i++) {
			entities.push({
				id: i.toString(),
				createdAt: faker.date.past(),
				updatedAt: faker.date.recent(),
			});
		}
		testEntity = entities[1];

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BaseService,
				{
					provide: getRepositoryToken(TestEntity),
					useClass: MockRepository,
				},
			],
		}).compile();

		service = module.get(BaseService);
		testRepository = module.get(getRepositoryToken(TestEntity));
		testRepository.entities = entities;
	});

	it('should check if the service is defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		const newTestEntity: TestEntity = { ...testEntity };
		beforeEach(() => {
			newTestEntity.id = entities.length.toString();
		});

		it('should create a new TestEntity', async () => {
			const newTestEntity: TestEntity = {
				...testEntity,
				id: entities.length.toString(),
			};

			const saveSpy = jest.spyOn(testRepository, 'save').mockResolvedValueOnce(newTestEntity);

			const result = await service.create(newTestEntity);

			expect(result).toMatchObject(newTestEntity);
			expect(saveSpy).toHaveBeenCalledWith(newTestEntity);
		});

		it('should throw a `DuplicateSourceException` when a TestEntity with the same id is created', async () => {
			await service.create(newTestEntity);

			await expect(
				service.create(newTestEntity, [
					{
						id: newTestEntity.id,
					},
				]),
			).rejects.toThrowError(DuplicateSourceException);
		});
	});

	describe('findOneById', () => {
		it('should find a TestEntity', async () => {
			const result = await service.findOneById(testEntity.id);

			expect(result).toMatchObject(testEntity);
		});

		it('should throw a `NotFoundException` if not entity with the id is found', async () => {
			const result = await service.findOneById(testEntity.id);

			expect(result).toMatchObject(testEntity);
		});
	});

	describe('findAll', () => {
		it('should return all entities', async () => {
			const results = await service.findAll();

			expect(entities.length).toBe(3);
			expect(results.length).toBe(entities.length);
		});
	});

	describe('update', () => {
		let updateEntity: TestEntity;
		beforeEach(() => {
			updateEntity = {
				...testEntity,
				createdAt: faker.date.future(),
			};
		});

		it('should update the testEntity', async () => {
			const results = await service.update('1', updateEntity);

			expect(results).toEqual(updateEntity);
		});

		it('should throw an `ConflictException` when the id of the entity is not found', async () => {
			await expect(service.update('4', updateEntity)).rejects.toThrowError(ConflictException);
		});
	});

	describe('delete', () => {
		it('should delete the testEntity', async () => {
			const results = await service.delete('1');

			expect(results).toEqual({
				affectedRows: 1,
				deletedElements: testEntity,
			} as IDeleteResponse<TestEntity>);
		});

		it('should throw an `ConflictException` when the id of the entity is not found', async () => {
			await expect(service.delete('99')).rejects.toThrowError(ConflictException);
		});
	});
});
