import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubStrategy } from '@rspd/shared/backend/utils';
import { GithubUser } from '@rspd/user/backend/common-models';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { GithubAuthorizationController } from './controller/github-authorization.controller';
import { GithubAuthorizationUserService } from './services/github-authorization-user.service';

@Module({
	imports: [RspdUserModule, TypeOrmModule.forFeature([GithubUser])],
	controllers: [GithubAuthorizationController],
	providers: [GithubAuthorizationUserService, GithubStrategy],
	exports: [RspdGithubAuthorizationModule, GithubAuthorizationUserService],
})
export class RspdGithubAuthorizationModule {}
