import { IsString } from 'class-validator';

/**
 * Configuration class for the Regensburg Student Progress Dashboard GitHub API integration.
 */
export class GithubConfig {
    /**
     * The client ID used to authenticate with the GitHub API.
     *
     * @type {string}
     */
    @IsString()
    clientId: string;

    /**
     * The client secret used to authenticate with the GitHub API.
     *
     * @type {string}
     */
    @IsString()
    clientSecret: string;
}
