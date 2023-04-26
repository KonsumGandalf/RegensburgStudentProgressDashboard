import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity } from '@rspd/shared/backend/utils';
import { Repository } from 'typeorm';

import { GenericRepositoryService } from './generic-repository.service';

export class TestEntity extends BaseEntity {}

/**
 * This Service was created to test the generic implementation with the most basic entity
 */
@Injectable()
export class BaseService extends GenericRepositoryService<TestEntity> {
	constructor(
		@InjectRepository(TestEntity)
		private readonly repository: Repository<TestEntity>,
	) {
		super(repository);
	}
}
