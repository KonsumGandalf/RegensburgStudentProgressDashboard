import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfig, GithubUser } from '@rspd/shared/backend/utils';
import { UserService } from '@rspd/user/backend/user-management';
import { Repository } from 'typeorm';

@Injectable()
export class GithubSubmissionService {
    constructor(
        private readonly _configService: ConfigService<AppConfig>,
        private readonly _userService: UserService,
        @InjectRepository(GithubUser)
        private readonly _githubUserRepo: Repository<GithubUser>
    ) {}
}
