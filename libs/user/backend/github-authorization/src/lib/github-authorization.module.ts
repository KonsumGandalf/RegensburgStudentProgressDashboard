import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubUser } from '@rspd/shared/backend/utils';
import { RspdUserModule } from '@rspd/user/backend/user-management';

import { GithubAuthorizationController } from './controller/github-authorization.controller';
import { GithubAuthorizationService } from './services/github-authorization.service';

@Module({
	imports: [RspdUserModule, TypeOrmModule.forFeature([GithubUser])],
	controllers: [GithubAuthorizationController],
	providers: [GithubAuthorizationService],
	exports: [RspdGithubAuthorizationModule],
})
export class RspdGithubAuthorizationModule {}
