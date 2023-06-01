import { Body, Controller, Get, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GithubOauthGuard, JwtAuthGuard } from '@rspd/shared/backend/utils';
import { IRequestLogin } from '@rspd/user/backend/common-models';

import { GithubUserDto } from '../models/dto/github-user.dto';
import { IGithubRequest } from '../models/interfaces/github-request.interfaces';
import { GithubAuthorizationUserService } from '../services/github-authorization-user.service';

@ApiTags('github-authorization')
@Controller('github')
export class GithubAuthorizationController {
	constructor(private readonly _githubService: GithubAuthorizationUserService) {}

	@Get()
	@UseGuards(JwtAuthGuard, GithubOauthGuard)
	async login(@Req() req) {
		console.log(req.session.test)
	}

	@Get('callback')
	@UseGuards(GithubOauthGuard)
	async authCallback(@Request() request) {
		console.log(request);
		console.log(request.user);
		// return await this._githubService.connectGithubAccount(request.user.id, request.session.userId);
	}
}
