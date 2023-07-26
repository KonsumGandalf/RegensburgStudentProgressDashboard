import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';

import { IAppConfig } from '../config/app-config.interface';
import { IGithubUser } from '../interfaces/github-user.interface';

/**
 * This Strategy allows users to authenticate their GitHub account.
 *
 * @see https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
 */
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
	constructor(private readonly _configService: ConfigService<IAppConfig>) {
		const appUrl = `http://${_configService.get('host', { infer: true })}:${_configService.get(
			'port',
			{ infer: true },
		)}`;
		super({
			clientID: _configService.get('github', {
				infer: true,
			}).clientId,
			clientSecret: _configService.get('github', {
				infer: true,
			}).clientSecret,
			callbackURL: `${appUrl}/api/github/callback`,
			scope: ['public_profile'],
		});
	}

	/**
	 * This method validates all information returned by the GitHub API.
	 *
	 * @param {string} accessToken - The access token obtained from GitHub OAuth.
	 * @param {string} refreshToken - The refresh token obtained from GitHub OAuth.
	 * @param {any} profile - The profile of the user obtained from GitHub API.
	 * @returns {Promise<IGithubUser>} - The validated user information.
	 */
	async validate(accessToken: string, refreshToken: string, profile: any): Promise<IGithubUser> {
		let avatarUrl: string;
		if(profile.avatarUrl && Array.isArray(profile.avatarUrl) && profile.avatarUrl[0]){
			avatarUrl = profile.avatarUrl[0];
		}

		return {
			username: profile.username,
			avatarUrl: avatarUrl,
			nodeId: profile._json.node_id,
			accessToken: accessToken
		} as IGithubUser;
	}

}
