import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfig, GenericRepositoryService, IGithubUser } from '@rspd/shared/backend/utils';
import { GithubUser } from '@rspd/user/backend/common-models';
import { StudentService, UserService } from '@rspd/user/backend/user-management';
import { Repository } from 'typeorm';


@Injectable()
export class GithubAuthorizationUserService extends GenericRepositoryService<GithubUser>{
	constructor(
		private readonly _configService: ConfigService<AppConfig>,
		private readonly _studentService: StudentService,
		@InjectRepository(GithubUser)
		private readonly _githubUserRepo: Repository<GithubUser>,
	) {
		super(_githubUserRepo);
	}

	async connectGithubAccount(id: string, githubUser: IGithubUser): Promise<IGithubUser> {
		const student = await this._studentService.findUser(id);
		return await this.create({
			...githubUser,
			student,
		} as GithubUser);
	}

	async findGithubUserByUser(userId: string): Promise<GithubUser | undefined> {
		return await this.findOptions({
			where: {
				user: {
					id: userId
				}
			}
		});
	}
}
