import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IGithubUser } from '@rspd/shared/backend/utils';

import { GithubAuthorizationService } from '../services/github-authorization.service';

@ApiTags('github-authorization')
@Controller('github')
export class GithubAuthorizationController {
	constructor(private readonly _githubService: GithubAuthorizationService) {}

	@Get('callback')
	async login(@Query('code') code: string): Promise<IGithubUser> {
		return this._githubService.createUser(code);
	}
}
