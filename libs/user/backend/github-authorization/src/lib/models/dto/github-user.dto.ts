import { IsString } from 'class-validator';

/**
 * Data transfer object for a Github user.
 */
export class GithubUserDto {
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
}
