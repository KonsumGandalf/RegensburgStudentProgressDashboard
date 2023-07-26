import { IGithubUser } from '@rspd/shared/backend/utils';
import { IsString } from 'class-validator';

/**
 * Data transfer object for a Github user.
 */
export class GithubUserDto implements IGithubUser{
	/**
	 * The username of the Github user.
	 */
	@IsString()
	username: string;

	/**
	 * The node ID of the Github user.
	 */
	@IsString()
	nodeId: string;

	/**
	 * The URL of the avatar image of the Github user.
	 */
	@IsString()
	avatarUrl: string;

	/**
	 * The accessToken for GitHub user.
	 */
	@IsString()
	accessToken: string;
}
