import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
	AppConfig,
	GenericRepositoryService,
	IResourceOwnerChecker,
} from '@rspd/shared/backend/utils';
import { Submission } from '@rspd/student-submissions/backend/common-models';
import { UserService } from '@rspd/user/backend/user-management';
import { Repository } from 'typeorm';

@Injectable()
export class SubmissionService
	extends GenericRepositoryService<Submission>
	implements IResourceOwnerChecker
{
	constructor(
		private readonly _configService: ConfigService<AppConfig>,
		private readonly _userService: UserService,
		@InjectRepository(Submission)
		private readonly _githubSubmissionRepo: Repository<Submission>,
	) {
		super(_githubSubmissionRepo);
	}

	async checkOwnership(id: string, username: string): Promise<boolean> {
		const submission = await super.findOptions({
			where: { id },
			relations: ['student'],
		});
		return submission.student.username === username;
	}

	async find(id: string): Promise<Submission> {
		return await this._githubSubmissionRepo.findOne({
			where: {
				id,
			},
			relations: ['tests'],
		});
	}
}
