import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
    createOAuthAppAuth,
    createOAuthUserAuth,
} from '@octokit/auth-oauth-app';
import { Octokit } from '@octokit/rest';
import { AppConfig, GithubUser, IGithubUser } from '@rspd/shared/backend/utils';
import { UserService } from '@rspd/user/backend/user-management';
import { Repository } from 'typeorm';

import { GithubUserDto } from '../models/dto/github-user.dto';

@Injectable()
export class GithubAccountService {
    constructor(
        private readonly _configService: ConfigService<AppConfig>,
        private readonly _userService: UserService,
        @InjectRepository(GithubUser)
        private readonly _githubUserRepo: Repository<GithubUser>
    ) {}

    async getAccessKey(code: string) {
        const { clientId, clientSecret } = this._configService.get('github', {
            infer: true,
        });
        const appAuth = createOAuthAppAuth({
            clientType: 'github-app',
            clientId: clientId,
            clientSecret: clientSecret,
        });

        const userAuth = await appAuth({
            type: 'oauth-user',
            code,
            factory: createOAuthUserAuth,
        });

        return (await userAuth()).token;
    }

    async getAuthenticatedUser(accessToken: string): Promise<GithubUserDto> {
        const authOctokit = new Octokit({
            auth: accessToken,
        });

        try {
            const { data } = await authOctokit.users.getAuthenticated();
            return {
                avatarUrl: data.avatar_url,
                username: data.login,
                nodeId: data.node_id,
            } as GithubUserDto;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to get authenticated user');
        }
    }

    async createUser(code: string): Promise<IGithubUser> {
        const accessToken = await this.getAccessKey(code);
        const user = await this.getAuthenticatedUser(accessToken);
        return await this._githubUserRepo.save(
            this._githubUserRepo.create({
                ...user,
                accessToken,
            } as GithubUser)
        );
    }
}
