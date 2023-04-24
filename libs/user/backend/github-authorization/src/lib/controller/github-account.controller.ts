import { Controller, Get, Query } from '@nestjs/common';
import { IGithubUser } from '@rspd/shared/backend/utils';

import { GithubAccountService } from '../services/github-account.service';

@Controller('github')
export class GithubAccountController {
    constructor(private readonly _githubService: GithubAccountService) {}

    @Get('callback')
    async login(@Query('code') code: string): Promise<IGithubUser> {
        return this._githubService.createUser(code);
    }
}
